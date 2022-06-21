import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { UserCouponListDTO } from '../../dto/coupon.dto';
import { AppMiddleware } from '../../middleware/app.middleware';
import { CouponService } from '../../service/coupon.service';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('api/coupon', { middleware: [AppMiddleware] })
export class UserCouponController extends BaseController {
  @Inject()
  couponService: CouponService;

  @Inject()
  queryService: QueryService;

  @Get('/list')
  @Validate()
  async list(@Query() dto: UserCouponListDTO) {
    const result = await this.couponService.getUserCoupons(
      false,
      -1,
      this.ctx.userInfo.userNo
    );
    const date = new Date();
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
    const overdueRes = await this.couponService.getUserCoupons(
      false,
      date.valueOf(),
      this.ctx.userInfo.userNo
    );
    const able = [] as any[];
    const disable = [] as any[];
    if (dto.price && dto.price > 0) {
      for (const res of result) {
        if (res.discountAmount <= dto.price) {
          if (res.conditionsAmount === 0) {
            able.push(res);
          } else if (dto.price >= res.conditionsAmount) {
            able.push(res);
          } else {
            disable.push(res);
          }
        }
      }
    }
    return this.responseSuccess('ok', {
      able: dto.price ? able : result,
      disable: disable,
      overdues: overdueRes,
    });
  }

  @Get('/able/count')
  async getCouponAble(@Query() dto: UserCouponListDTO) {
    const date = new Date();
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
    const result = await this.couponService.getAbleCouponCount(
      this.ctx.userInfo.userNo,
      dto.price
    );
    return this.responseSuccess('ok', result[0].num);
  }

  /**
   * 获取未读的优惠券
   * @returns
   */
  @Get('/unread')
  async getUnreadCoupon() {
    const result = await this.queryService.select(
      this.couponService.couponEntity,
      {
        tables: 'user_coupon uc , coupons co',
        wheres: `uc.isLook = 0 and uc.userNo='${this.ctx.userInfo.userNo}' and uc.couponNo = co.couponNo`,
        fields:
          'uc.*,co.couponName,co.discountAmount,co.conditionsAmount,co.conditionService',
        current: 1,
        pageSize: 4,
      }
    );
    const now = Date.now();
    for (const item of result.data) {
      if (parseInt(item.deadlineTime) !== -1) {
        if (now >= parseInt(item.deadlineTime)) {
          item.deadlineText = '已过期';
        } else {
          const day = Math.round(
            ((now - parseInt(item.deadlineTime)) / 24) * 60 * 60 * 1000
          );
          item.deadlineText = '有效期' + day + '天';
        }
      }
    }
    return this.responseSuccess('ok', result);
  }

  @Put('/read')
  @Validate()
  async postReadCoupon(@Body('ids') ids: number[]) {
    await this.couponService.userCouponEntity.query(
      `update user_coupon set isLook=1 where id in (${ids.toString()})`
    );

    return this.responseSuccess('ok');
  }
}
