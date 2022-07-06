import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { CONFIG_COUPON } from '../constant';
import { CouponSetDTO, GetRulesProbability } from '../dto/config.dto';
import { CouponEntity } from '../entity/coupon.entity';
import { UserCouponEntity } from '../entity/userCoupon.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';

@Provide()
export class CouponService extends BaseService {
  @InjectEntityModel(CouponEntity)
  couponEntity: Repository<CouponEntity>;

  @InjectEntityModel(UserCouponEntity)
  userCouponEntity: Repository<UserCouponEntity>;

  @Inject()
  configService: ConfigService;

  async findByNo(couponNo: string) {
    return await this.couponEntity.findOne({ where: { couponNo } });
  }

  /**
   * 新用户获得优惠券
   * @param userNo
   */
  async newUserAccess(userNo: string) {
    const config = (await this.configService.getConfig(
      CONFIG_COUPON,
      false
    )) as CouponSetDTO | false;
    if (!config) {
      return;
    }
    // 检查是否开启了新用户获得优惠券的通道
    if (!config.newUserOpen) {
      return;
    }

    // 优惠券获得的范围
    const arrs = this.getCouponRange(config.newUserRules);

    const random = Math.floor(Math.random() * 10000);
    for (const arr of arrs) {
      if (random >= arr.pnum[0] && random < arr.pnum[1]) {
        // 发送优惠券
        const coupon = await this.findByNo(arr.couponNo);
        if (coupon && coupon.status === 1) {
          if (
            coupon.limitNumber !== -1 &&
            coupon.cumulativeDrawNo < coupon.limitNumber
          ) {
            continue;
          }
          const add = await this.userCouponEntity.insert({
            couponNo: arr.couponNo,
            userNo,
            deadlineTime:
              coupon.deadlineDays > -1
                ? Date.now() + coupon.deadlineDays * 1000 * 60 * 60 * 24
                : -1,
            originDesc: '新用户登录',
          });
          if (add.raw.insertId) {
            await this.couponEntity.increment(
              {
                couponNo: arr.couponNo,
              },
              'cumulativeDrawNo',
              1
            );
          }
        }
      }
    }
  }

  // 优惠券获得的范围
  getCouponRange(rules: GetRulesProbability[]) {
    const arrs = [] as { couponNo: string; pnum: number[] }[];
    for (let i = 0; i < rules.length; i++) {
      const params = rules[i];
      if (params.probability > 0) {
        const pnum = Math.floor(params.probability * 100);
        if (arrs.length === 0) {
          arrs.push({ couponNo: params.couponNo, pnum: [0, pnum] });
        } else if (pnum + arrs[arrs.length - 1][1] <= 10000) {
          arrs.push({
            couponNo: params.couponNo,
            pnum: [arrs[arrs.length - 1][1], pnum + arrs[arrs.length - 1][1]],
          });
        } else {
          const num = pnum + arrs[arrs.length - 1][1] - 10000;
          arrs.push({
            couponNo: params.couponNo,
            pnum: [arrs[arrs.length - 1][1], 10000],
          });
          arrs.push({ couponNo: params.couponNo, pnum: [0, num] });
        }
      }
    }
    return arrs;
  }

  /**
   * 获取个人优惠券
   * @param isUse 是否已使用
   * @param overdue 是否已过期
   * @param userNo 用户编号
   * @returns
   */
  async getUserCoupons(isUse: boolean, overdue: number, userNo: string) {
    const sql = `select uc.*,co.couponName,co.discountAmount,co.conditionsAmount,co.conditionService from user_coupon uc,coupons co 
    where uc.userNo='${userNo}' and uc.isDelete=0 and uc.couponNo = co.couponNo and uc.isUse=${
      isUse ? 1 : 0
    } and (${
      overdue !== -1
        ? 'uc.deadlineTime != -1 and uc.deadlineTime-' +
          Date.now() +
          '<=0 and uc.deadlineTime > ' +
          overdue
        : 'uc.deadlineTime=-1 or uc.deadlineTime-' + Date.now() + '>0'
    })`;
    return await this.userCouponEntity.query(sql);
  }

  /**
   * 获取可用优惠券数量
   * @param userNo
   * @param overdue
   * @returns
   */
  async getAbleCouponCount(userNo: string, price: number) {
    const sql = `select count(*) as num from user_coupon uc,coupons co
     where uc.userNo='${userNo}' and uc.isDelete=0 and uc.couponNo = co.couponNo and uc.isUse=0 
     and (uc.deadlineTime=-1 or uc.deadlineTime-${Date.now()}>0) and co.discountAmount <= ${price} and (co.conditionsAmount=0 or co.conditionsAmount <= ${price})`;
    return await this.userCouponEntity.query(sql);
  }

  /**
   * 查询用户的一张优惠券
   * @param id
   * @param userNo
   * @returns
   */
  async userCouponFindById(id: number, userNo: string) {
    const sql = `select uc.*,co.couponName,co.discountAmount,co.conditionsAmount,co.conditionService from user_coupon uc,coupons co 
    where uc.couponNo = co.couponNo and uc.id = ${id} and uc.isDelete=0 and uc.userNo = '${userNo}'`;
    const result = await this.userCouponEntity.query(sql);
    if (result.length === 0) {
      return undefined;
    }
    return result[0];
  }

  /**
   * 核销优惠券
   * @param id
   */
  async writeOffCoupon(id: number) {
    const update = await this.userCouponEntity.update(
      {
        id,
        isUse: false,
        isDelete: false,
      },
      {
        isUse: true,
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('核销优惠券失败');
    }
  }
}
