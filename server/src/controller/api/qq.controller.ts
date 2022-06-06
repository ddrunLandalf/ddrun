import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { CONFIG_APPAUTH_INFO } from '../../constant';
import { AppauthUpsertDTO } from '../../dto/config.dto';
import { WxappLoginDTO } from '../../dto/wxapp.dto';
import { DefaultError } from '../../error/default.error';
import { ConfigService } from '../../service/config.service';
import { HttpService } from '../../service/http.service';
import { QQService } from '../../service/qq/qq.service';
import { UserService } from '../../service/user.service';
import { BaseController } from '../base.controller';

@Controller('/api/qq')
export class QQController extends BaseController {
  @Inject()
  configService: ConfigService;

  @Inject()
  httpService: HttpService;

  @Inject()
  userService: UserService;

  @Inject()
  qqService: QQService;

  @Get('/login')
  async login(@Query() loginDTO: WxappLoginDTO) {
    // 获取小程序配置
    const result = (await this.configService.getConfig(
      CONFIG_APPAUTH_INFO
    )) as AppauthUpsertDTO;
    if (!result.qqAppid || !result.qqAppSecret) {
      throw new DefaultError('暂无凭证信息配置');
    }
    const res = (await this.httpService.get(
      'https://api.q.qq.com/sns/jscode2session',
      {
        appid: result.qqAppid,
        secret: result.qqAppSecret,
        js_code: loginDTO.code,
        grant_type: 'authorization_code',
      }
    )) as {
      errcode?: number;
      errmsg?: string;
      openid?: string;
      session_key?: string;
    };
    if (res.errcode || !res.openid || !res.session_key) {
      throw new DefaultError(res.errmsg);
    }
    const findRes = await this.qqService.findByOpenid(res.openid);
    if (!findRes) {
      const qqappNo = this.nanoid(32);
      await this.qqService.qqappEntity.insert({
        openid: res.openid,
        qqappNo,
      });
      return this.responseSuccess('ok', { qqappNo });
    }
    if (findRes.userNo) {
      const user = await this.userService.findByNo(findRes.userNo);
      if (user) {
        return this.responseSuccess('ok', {
          qqappNo: findRes.qqappNo,
          user: this.userService.getUserInfo(user),
        });
      }
    }
    return this.responseSuccess('ok', { qqappNo: findRes.qqappNo });
  }
}
