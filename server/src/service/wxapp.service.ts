import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { CONFIG_APPAUTH_INFO, WXAPP_ACCESSTOKEN } from '../constant';
import { AppauthUpsertDTO } from '../dto/config.dto';
import { WxappEntity } from '../entity/wxapp.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { WxService } from './wx.service';

@Provide()
export class WxappService extends BaseService {
  @InjectEntityModel(WxappEntity)
  wxappEntity: Repository<WxappEntity>;

  @Inject()
  http: HttpService;

  @Inject()
  configService: ConfigService;

  @Inject()
  wxService: WxService;

  async findByOpenid(openid: string) {
    return await this.wxappEntity.findOne({ where: { openid } });
  }

  async findByNo(wxappNo: string) {
    return await this.wxappEntity.findOne({ where: { wxappNo } });
  }

  /**
   * 获取微信小程序的用户手机号
   * @param code 手机号获取凭证
   * @returns
   */
  async getUserPhoneNumber(code: string) {
    const accessToken = await this.getAccessToken();
    const result = (await this.http.post(
      'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' +
        accessToken,
      {
        code,
      }
    )) as {
      errcode?: number;
      errmsg?: string;
      phone_info?: {
        phoneNumber: string;
        purePhoneNumber: string;
        countryCode: string;
      };
    };
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result;
  }

  async getAccessToken() {
    const accessToken = await this.redis.get(WXAPP_ACCESSTOKEN);
    if (accessToken) {
      return accessToken;
    }
    const config = (await this.configService.getConfig(
      CONFIG_APPAUTH_INFO
    )) as AppauthUpsertDTO;
    const result = (await this.http.get(
      'https://api.weixin.qq.com/cgi-bin/token',
      {
        grant_type: 'client_credential',
        appid: config.wxAppId,
        secret: config.wxAppSecret,
      }
    )) as { access_token?: string; errmsg?: string; expires_in?: number };
    if (!result.access_token) {
      throw new DefaultError(result.errmsg);
    }
    await this.redis.set(
      WXAPP_ACCESSTOKEN,
      result.access_token,
      'EX',
      result.expires_in
    );
    return result.access_token;
  }

  /**
   * 统一下单支付
   * @param orderNo
   * @param totalPrice
   * @param des
   * @returns
   */
  async payUnifiedorder(orderNo: string, totalPrice: number, des: string) {
    const wxapyBody = await this.wxService.wxpayBodyData(
      orderNo,
      this.ctx.userInfo.openid,
      totalPrice,
      des
    );
    const result = await this.http.post(
      'https://api.mch.weixin.qq.com/pay/unifiedorder',
      wxapyBody.bodyData
    );
    const json = ((await this.wxService.xml2JSON(result)) as { xml: any }).xml;
    if (json.return_code[0] === 'FAIL') {
      throw new DefaultError(json.return_msg[0]);
    }
    return json;
  }
}
