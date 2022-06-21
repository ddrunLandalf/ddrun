import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { ResultResponse } from '../../interface';
import { BaseController } from '../base.controller';
import { AddressParseDTO, MapLocationDTO } from '../../dto/map.dto';
import { MapService } from '../../service/map.service';
import { CitysService } from '../../service/citys.service';
import { Validate } from '@midwayjs/validate';
import { DefaultError } from '../../error/default.error';
import { CouponService } from '../../service/coupon.service';
import { AppMiddleware } from '../../middleware/app.middleware';
import { ConfigService } from '../../service/config.service';
import {
  CONFIG_AGREEMENT_RIDER,
  CONFIG_GUIDE_RIDER,
  CONFIG_GUIDE_USER,
  CONFIG_INTEGRAL,
  CONFIG_NOTICE,
  CONFIG_ORDER_FEE,
  CONFIG_SHARE,
} from '../../constant';

@Controller('/api/home')
export class HomeController extends BaseController {
  @Inject()
  mapService: MapService;

  @Inject()
  cityService: CitysService;

  @Inject()
  couponService: CouponService;

  @Inject()
  configService: ConfigService;

  @Get('/')
  @Validate()
  async getApp(@Query() mapDTO: MapLocationDTO): Promise<ResultResponse> {
    // 获取逆地址解析数据
    const result = await this.mapService.inverseAddressResolution(
      mapDTO.latitude,
      mapDTO.longitude
    );
    const { province, city, district, street_number } =
      result.address_component;
    const cityResult = '北京市上海市天津市重庆市'.includes(province)
      ? await this.cityService.findByCity(province, province)
      : await this.cityService.findByCity(province, city);
    if (!cityResult) {
      return this.responseFail('该城市暂未开通服务', {
        cityName: city,
      });
    }
    const response = {
      province: cityResult.province,
      cityName: cityResult.cityName,
      cityNo: cityResult.cityNo,
      address: {
        province,
        city,
        district,
        latitude: result.location.lat,
        longitude: result.location.lng,
        streetNumber: street_number,
        addressDetail: result.formatted_addresses.recommend,
      },
    } as any;
    if (cityResult.citysWeightTagId) {
      const weight = await this.cityService.weightFindById(
        cityResult.citysWeightTagId
      );
      response.weights = weight.tags;
    }
    if (cityResult.citysTagGroupId) {
      const group = await this.cityService.tagFindById(
        cityResult.citysTagGroupId
      );
      response.tags = group.tags;
    }
    return this.responseSuccess('ok', response);
  }

  @Get('/city')
  async getByCity(@Query() dto: AddressParseDTO) {
    const cityResult = await this.cityService.findByOnlyCity(dto.keyword);
    if (!cityResult) {
      throw new DefaultError('该城市暂未开通运营');
    }
    const response = {
      province: cityResult.province,
      cityName: cityResult.cityName,
      cityNo: cityResult.cityNo,
    } as any;
    if (cityResult.citysWeightTagId) {
      const weight = await this.cityService.weightFindById(
        cityResult.citysWeightTagId
      );
      response.weights = weight.tags;
    }
    if (cityResult.citysTagGroupId) {
      const group = await this.cityService.tagFindById(
        cityResult.citysTagGroupId
      );
      response.tags = group.tags;
    }
    return this.responseSuccess('ok', response);
  }

  @Get('/mine', { middleware: [AppMiddleware] })
  async getMine() {
    const couponCount = await this.couponService.userCouponEntity.count({
      where: `isUse = 0 and isDelete = 0 and userNo = '${
        this.ctx.userInfo.userNo
      }' and (deadlineTime = -1 or deadlineTime > ${Date.now()})`,
    });

    const { intergralSum, integralReduceSum } = await this.getUserIntegral();
    return this.responseSuccess('ok', {
      couponCount,
      intergralCount: parseInt(intergralSum) - parseInt(integralReduceSum),
    });
  }

  async getUserIntegral() {
    const integralQuery = await this.couponService.userCouponEntity.query(
      `SELECT sum(integral) as total FROM balance_sheet where userNo='${this.ctx.userInfo.userNo}'`
    );
    const intergralSum = integralQuery[0].total || 0;
    const integralReduceQuery = await this.couponService.userCouponEntity.query(
      `SELECT sum(intergal) as total FROM orders where userNo='${this.ctx.userInfo.userNo}' and status>0`
    );
    const integralReduceSum = integralReduceQuery[0].total || 0;
    return {
      intergralSum,
      integralReduceSum,
      integralBalance: parseInt(intergralSum) - parseInt(integralReduceSum),
    };
  }

  @Get('/text')
  async getText(@Query('type') type: 'user' | 'rider' | 'riderAgreement') {
    let key = '';
    switch (type) {
      case 'user':
        key = CONFIG_GUIDE_USER;
        break;
      case 'rider':
        key = CONFIG_GUIDE_RIDER;
        break;
      case 'riderAgreement':
        key = CONFIG_AGREEMENT_RIDER;
        break;
    }
    const res = await this.configService.getConfig(key);
    return this.responseSuccess('ok', res);
  }

  @Get('/config')
  async getConfig() {
    const notice = await this.configService.getConfig(CONFIG_NOTICE, false);
    const share = await this.configService.getConfig(CONFIG_SHARE, false);
    const fee = await this.configService.getConfig(CONFIG_ORDER_FEE, false);
    return this.responseSuccess('ok', {
      notice,
      share,
      fee,
    });
  }

  @Get('/integral', { middleware: [AppMiddleware] })
  async getIntegral() {
    const { integralBalance } = await this.getUserIntegral();
    const config = await this.configService.getConfig(CONFIG_INTEGRAL, false);
    return this.responseSuccess('ok', {
      integralBalance,
      config,
    });
  }
}
