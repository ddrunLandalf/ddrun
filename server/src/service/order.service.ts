import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { QueueService } from '@midwayjs/task';
import { EntityManager, Repository } from 'typeorm';
import {
  CONFIG_INTEGRAL,
  CONFIG_ORDER_CANCEL,
  CONFIG_ORDER_FEE,
} from '../constant';
import {
  ConfigCancelOrderDTO,
  ConfigIntegralDTO,
  ConfigOrderFeeDTO,
} from '../dto/config.dto';
import {
  Address,
  OrderCancelDTO,
  OrderPublishDTO,
  OrderReceiveDTO,
} from '../dto/order.dto';
import { BalanceSheetEntity } from '../entity/balanceSheet.entity';
import { CitysValuationEntity } from '../entity/citysValuation.entity';
import { OrderEntity } from '../entity/orders.entity';
import { DefaultError } from '../error/default.error';
import { OrderCompleteBy, OrderType, ServerType } from '../interface';
import {
  OrderAutoToCompleteTask,
  ORDER_COMPLETE_DELAY,
} from '../task/order.task';
import { BaseService } from './base.service';
import { CitysService } from './citys.service';
import { ConfigService } from './config.service';
import { CouponService } from './coupon.service';
import { MapService } from './map.service';
import { RiderService } from './rider.service';
import { WxSubscribeMessageService } from './wx/subscribeMessage.service';
import { WxappService } from './wxapp.service';

interface OrderParams {
  distance: number;
  startPrice: number;
  totalPrice: number;
  distancePrice: number;
  weightPrice: number;
  timePrice: number;
  discountPrice: number;
  userCouponId?: number;
  weightValue: number;
  weightLabel: string;
  distanceLabel: string;
  serviceType: ServerType;
  fee: number;
  intergralPrice: number;
  couponDiscount: number;
}
@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  mapService: MapService;

  @Inject()
  configService: ConfigService;

  @Inject()
  cityService: CitysService;

  @InjectEntityModel(CitysValuationEntity)
  valuationEntity: Repository<CitysValuationEntity>;

  @Inject()
  couponService: CouponService;

  @Inject()
  riderService: RiderService;

  @Inject()
  subscribeService: WxSubscribeMessageService;

  @InjectEntityModel(BalanceSheetEntity)
  balanceSheetEntity: Repository<BalanceSheetEntity>;

  @Inject()
  wxappService: WxappService;

  @Inject()
  queueService: QueueService;

  /**
   * ????????????
   * @param dto
   */
  async orderCancel(
    dto: OrderCancelDTO,
    cancelBy: OrderCompleteBy,
    cancelByNo?: string
  ) {
    return await this.orderEntity.manager.transaction(async () => {
      const order = await this.orderEntity.findOne({
        where: { orderNo: dto.orderNo },
        transaction: true,
      });
      if (!order) {
        throw new DefaultError('???????????????');
      }
      if (order.status === -1) {
        throw new DefaultError('???????????????');
      } else if (order.status === -2) {
        throw new DefaultError('???????????????');
      } else if (order.status === 3) {
        throw new DefaultError('???????????????');
      } else if (order.status === 4) {
        throw new DefaultError('???????????????');
      }

      await this.orderRefund(order, cancelBy);
      const update = await this.orderEntity.update(
        {
          orderNo: dto.orderNo,
        },
        {
          status: -2,
          cancelTime: new Date(),
          cancelBy,
          cancelByNo,
          cancelReason: dto.cancelReason,
        }
      );
      if (update.affected === 0) {
        throw new DefaultError('??????????????????');
      }

      if (order.userCouponId) {
        const recover = await this.couponService.userCouponEntity.update(
          {
            id: order.userCouponId,
          },
          {
            isUse: false,
          }
        );
        if (recover.affected === 0) {
          throw new DefaultError('?????????????????????');
        }
      }
      order.status = -2;
      /**
       * ????????????????????????
       */
      this.subscribeService.orderStatusChangeNoticeSend(order);
      return true;
    });
  }

  /**
   * ????????????????????????
   * @param order
   * @param cancelBy
   * @returns
   */
  async getCancelText(order: OrderEntity, cancelBy: OrderCompleteBy) {
    const cancelConfig = (await this.configService.getConfig(
      CONFIG_ORDER_CANCEL,
      false
    )) as ConfigCancelOrderDTO;
    let desc = '';
    if (cancelConfig) {
      if (order.status === 2 && cancelBy === 'user') {
        // ??????????????????
        // ??????????????????
        const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
        for (const item of cancelConfig.userCancelRules) {
          if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
            const platformIncome = this.filterNumber(
              (order.payAmount - order.fee) * item.price
            );
            desc += `???????????????${item.timeRange[0]}~${
              item.timeRange[1]
            }???????????????????????????${Math.floor(
              item.price * 100
            )}%?????????,???${platformIncome}???`;
            break;
          }
        }
      } else if (order.status === 2 && cancelBy === 'rider') {
        const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
        for (const item of cancelConfig.riderCancelRules) {
          if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
            const riderReduce = Math.floor(
              Math.round((order.payAmount - order.fee) * item.price)
            );
            desc += `???????????????${item.timeRange[0]}~${
              item.timeRange[1]
            }??????????????????????????????????????????${Math.floor(
              item.price * 100
            )}%???????????????,???${riderReduce}???`;
            break;
          }
        }
      }
    }
    return desc;
  }

  /**
   * ??????
   */
  async orderRefund(order: OrderEntity, cancelBy: OrderCompleteBy) {
    if (order.status === 1 || order.status === 2) {
      // ????????????
      let refundFee =
        Math.floor(Math.round((order.payAmount - order.fee) * 100)) / 100;
      let platformIncome = 0;
      let riderReduce = 0;
      let desc = '';
      const cancelConfig = (await this.configService.getConfig(
        CONFIG_ORDER_CANCEL,
        false
      )) as ConfigCancelOrderDTO;
      if (cancelConfig) {
        if (order.status === 2 && cancelBy === 'user') {
          // ??????????????????
          // ??????????????????
          desc = '????????????????????????';
          const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
          for (const item of cancelConfig.userCancelRules) {
            if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
              platformIncome =
                Math.floor(
                  Math.round((order.payAmount - order.fee) * item.price * 100)
                ) / 100;
              desc += `,???????????????${item.timeRange[0]}~${
                item.timeRange[1]
              }?????????????????????${Math.floor(item.price * 100)}%?????????`;
              break;
            }
          }
          refundFee -= platformIncome;
        } else if (order.status === 2 && cancelBy === 'rider') {
          desc = '??????????????????';
          const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
          for (const item of cancelConfig.riderCancelRules) {
            if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
              riderReduce = Math.floor(
                Math.round((order.payAmount - order.fee) * item.price)
              );
              platformIncome = riderReduce;
              desc += `,???????????????${item.timeRange[0]}~${
                item.timeRange[1]
              }????????????????????????????????????${Math.floor(
                item.price * 100
              )}%???????????????`;
              break;
            }
          }
        }
        if (platformIncome > 0 || riderReduce > 0) {
          const city = await this.cityService.citysEntity.findOne({
            where: { cityName: order.city },
            transaction: true,
          });
          const insert = await this.balanceSheetEntity.save(
            {
              cityNo: city.cityNo,
              orderNo: order.orderNo,
              riderNo: order.riderNo,
              agentNo: city.agentNo,
              platformIncome,
              agentIncome: 0,
              riderIncome: -riderReduce,
              desc,
              userNo: order.userNo,
            },
            {
              transaction: true,
            }
          );
          if (!insert) {
            throw new DefaultError('??????????????????');
          }
        }
      }

      /** ?????????????????? */
      if (refundFee > 0) {
        await this.wxappService.refund(
          order.orderNo,
          order.payAmount,
          refundFee,
          order.cancelReason
        );
      }
      /** ?????????????????? */

      return refundFee;
    }
    return 0;
  }

  /**
   * ????????????
   * @param orderNo
   */
  async orderClose(orderNo: string) {
    const update = await this.orderEntity.update(
      {
        orderNo,
        status: 0,
      },
      {
        status: -1,
        closeTime: new Date(),
      }
    );
    if (update.affected === 0) {
      return false;
    }
    return true;
  }

  /**
   * ??????
   * @param param0
   */
  async orderReceive(dto: OrderReceiveDTO) {
    return await this.orderEntity.manager.transaction(
      async (entity: EntityManager) => {
        const rider = await this.riderService.riderEntity.findOne({
          where: { riderNo: dto.riderNo },
        });
        if (!rider) {
          throw new DefaultError('???????????????');
        }
        if (rider.status === 0) {
          throw new DefaultError('???????????????');
        }
        if (!rider.startReceive) {
          throw new DefaultError('?????????????????????');
        }
        const order = await this.orderEntity.findOne({
          where: { orderNo: dto.orderNo },
          transaction: true,
        });
        if (!order) {
          throw new DefaultError('???????????????');
        }
        if (order.status === 0) {
          throw new DefaultError('??????????????????');
        } else if (order.status === -1) {
          throw new DefaultError('???????????????');
        } else if (order.status === -2) {
          throw new DefaultError('???????????????');
        } else if (order.status === 2) {
          throw new DefaultError('????????????');
        } else if (order.status === 3) {
          throw new DefaultError('???????????????');
        } else if (order.status === 4) {
          throw new DefaultError('???????????????');
        }

        const update = await entity.update(
          this.orderEntity.target,
          {
            orderNo: dto.orderNo,
          },
          {
            status: 2,
            sendTime: new Date(),
            riderNo: dto.riderNo,
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('????????????');
        }
        order.status = 2;
        /**
         * ????????????????????????
         */
        this.subscribeService.orderStatusChangeNoticeSend(order);
        return true;
      }
    );
  }

  /**
   * ????????????
   */
  async orderDeliver(orderNo: string, riderNo: string) {
    const order = await this.orderEntity.findOne({
      where: { orderNo },
    });
    if (!order) {
      throw new DefaultError('???????????????');
    }
    if (order.status === 0) {
      throw new DefaultError('??????????????????');
    } else if (order.status === -1) {
      throw new DefaultError('???????????????');
    } else if (order.status === -2) {
      throw new DefaultError('???????????????');
    } else if (order.status === 1) {
      throw new DefaultError('????????????');
    } else if (order.status === 3) {
      throw new DefaultError('???????????????');
    } else if (order.status === 4) {
      throw new DefaultError('???????????????');
    }

    const update = await this.orderEntity.update(
      {
        orderNo,
        riderNo,
      },
      {
        status: 3,
        getTime: new Date(),
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('??????????????????');
    }
    await this.queueService.execute(
      OrderAutoToCompleteTask,
      { orderNo },
      { delay: ORDER_COMPLETE_DELAY }
    );
    order.status = 3;

    /**
     * ????????????????????????
     */
    this.subscribeService.orderStatusChangeNoticeSend(order);
  }

  /**
   * ????????????
   */
  async orderComplete(
    orderNo: string,
    completeBy: OrderCompleteBy,
    completeByNo?: string
  ) {
    return await this.orderEntity.manager.transaction(
      async (entity: EntityManager) => {
        const order = await this.orderEntity.findOne({
          where: { orderNo },
          transaction: true,
        });
        if (!order) {
          throw new DefaultError('???????????????');
        }
        if (order.status === 0) {
          throw new DefaultError('??????????????????');
        } else if (order.status === -1) {
          throw new DefaultError('???????????????');
        } else if (order.status === -2) {
          throw new DefaultError('???????????????');
        } else if (order.status === 1) {
          throw new DefaultError('????????????');
        } else if (order.status === 2) {
          throw new DefaultError('?????????????????????');
        } else if (order.status === 4) {
          throw new DefaultError('???????????????');
        }

        const update = await entity.update(
          this.orderEntity.target,
          {
            orderNo,
          },
          {
            status: 4,
            successTime: new Date(),
            completeBy,
            completeByNo,
          }
        );
        if (!update) {
          throw new DefaultError('????????????');
        }

        // ??? ?????? ?????? ?????? ?????????
        await this.assetsPartition(order);
        return true;
      }
    );
  }

  /**
   * ????????????
   * @param order
   */
  async assetsPartition(order: OrderEntity) {
    const city = await this.cityService.citysEntity.findOne({
      where: { cityName: order.city },
      transaction: true,
    });
    if (!city) {
      throw new DefaultError('???????????????');
    }
    // ?????????????????????
    const totalPrice = order.discountPrice + order.payAmount - order.fee;
    // ????????????
    let platformIncome = 0;
    // ????????????
    let agentIncome = 0;
    // ????????????
    let riderFee = 0;

    let desc = '';
    if (order.serviceType === 'helpDeliver') {
      platformIncome =
        totalPrice * city.extractHelpDeliver - order.discountPrice;
      agentIncome = totalPrice * city.extractHelpDeliverForAgent;
      desc = `P:${Math.floor(city.extractHelpDeliver * 100)}%-A:${Math.floor(
        city.extractHelpDeliverForAgent * 100
      )}%`;
    } else if (order.serviceType === 'helpGet') {
      platformIncome = totalPrice * city.extractHelpGet - order.discountPrice;
      agentIncome = totalPrice * city.extractHelpGetForAgent;
      desc = `P:${Math.floor(city.extractHelpGet * 100)}%-A:${Math.floor(
        city.extractHelpGetForAgent * 100
      )}%`;
    } else {
      platformIncome = totalPrice * city.extractHelpBuy - order.discountPrice;
      agentIncome = totalPrice * city.extractHelpBuyForAgent;
      desc = `P:${Math.floor(city.extractHelpBuy * 100)}%-A:${Math.floor(
        city.extractHelpBuyForAgent * 100
      )}%`;
    }

    /**????????????????????? */
    const feeConfig = (await this.configService.getConfig(
      CONFIG_ORDER_FEE,
      false
    )) as ConfigOrderFeeDTO;
    if (feeConfig) {
      let pe = 0;
      let ae = 0;
      if (feeConfig.platformExtract && feeConfig.platformExtract > 0) {
        pe = feeConfig.platformExtract * order.fee;
      }
      if (feeConfig.agentExtract && feeConfig.agentExtract > 0) {
        ae = feeConfig.agentExtract * order.fee;
      }
      platformIncome += pe;
      agentIncome += ae;
      riderFee = order.fee - pe - ae;
      desc += `;??????P:${Math.floor(
        feeConfig.platformExtract * 100
      )}%-A:${Math.floor(feeConfig.agentExtract * 100)}%-R:${riderFee}???`;
    }
    /**????????????????????? */

    platformIncome = Math.floor(Math.round(platformIncome * 100)) / 100;
    agentIncome = Math.floor(Math.round(agentIncome * 100)) / 100;

    //????????????
    const riderIncome =
      Math.floor(
        Math.round((totalPrice - platformIncome - agentIncome + riderFee) * 100)
      ) / 100;
    const insert = await this.balanceSheetEntity.save(
      {
        cityNo: city.cityNo,
        orderNo: order.orderNo,
        riderNo: order.riderNo,
        agentNo: city.agentNo,
        platformIncome,
        agentIncome,
        riderIncome,
        desc,
        userNo: order.userNo,
        integral: Math.floor(order.payAmount * 100),
      },
      {
        transaction: true,
      }
    );
    if (!insert) {
      throw new DefaultError('??????????????????');
    }
  }

  async findByNo(orderNo: string) {
    return await this.orderEntity.findOne({ where: { orderNo } });
  }

  async add(
    params: OrderParams,
    {
      startAddress,
      endAddress,
      goodsDesc,
      status,
    }: {
      startAddress?: Address;
      endAddress: Address;
      goodsDesc: string;
      status?: OrderType;
    }
  ) {
    const result = await this.orderEntity.manager.transaction(async () => {
      const orderNo = this.nanoid(32);
      const add = await this.orderEntity.insert({
        orderNo,
        payAmount: params.totalPrice,
        serviceType: params.serviceType,
        timePrice: params.timePrice,
        distancePrice: params.distancePrice,
        weightPrice: params.weightPrice,
        startPrice: params.startPrice,
        distance: params.distance,
        weight: params.weightValue,
        startAddress,
        endAddress,
        goodsDesc,
        discountPrice: params.discountPrice,
        userNo: this.ctx.userInfo.userNo,
        userCouponId: params.userCouponId,
        couponDiscount: params.couponDiscount,
        // ?????????????????????
        status: status || 0,
        city: endAddress.city,
        fee: params.fee,
        intergalDiscount: params.intergralPrice,
      });
      if (!add.raw.insertId) {
        throw new DefaultError('??????????????????');
      }
      if (params.userCouponId) {
        await this.couponService.writeOffCoupon(params.userCouponId);
      }
      return orderNo;
    });
    return result;
  }

  /**
   * ????????????
   * @param param0
   */
  async calculationPrice({
    startAddress,
    endAddress,
    serviceType,
    weight,
    userCouponId,
    fee,
    intergral,
  }: OrderPublishDTO) {
    // ??????
    let distance = 0;
    let totalPrice = 0;
    let distancePrice = 0;
    let weightPrice = 0;
    let timePrice = 0;
    let discountPrice = 0;
    let weightValue = 0;
    let couponDiscount = 0;
    if (typeof weight === 'number') {
      weightValue = weight;
    } else {
      // ???????????????
      weightValue = weight[1];
    }
    if (serviceType === 'helpBuy' && !startAddress) {
      distance = 3000;
    } else {
      distance = await this.calculationDistance(
        `${startAddress.latitude},${startAddress.longitude}`,
        `${endAddress.latitude},${endAddress.longitude}`
      );
    }

    const city = await this.cityService.findByOnlyCity(
      startAddress ? startAddress.city : endAddress.city
    );
    if (!city) {
      throw new DefaultError('???????????????????????????');
    }
    totalPrice += city.startPrice;

    // ????????????????????????
    if (city.citysValuationId) {
      const valuation = await this.valuationEntity.findOne({
        where: { id: city.citysValuationId },
      });
      const rule = valuation.ruleContext;
      // ???????????????????????????
      for (const dtans of rule.distance) {
        if (distance > dtans.gt * 1000 && distance <= dtans.lte * 1000) {
          // ????????????????????????
          if (dtans.unitDistance > 0) {
            distancePrice =
              Math.ceil(
                (distance - dtans.gt * 1000) / (dtans.unitDistance * 1000)
              ) * dtans.price;
          } else {
            distancePrice = dtans.price;
          }
          break;
        }
      }
      totalPrice += distancePrice;
      // ???????????????????????????
      for (const wet of rule.weight) {
        if (weightValue > wet.gt && weightValue <= wet.lte) {
          if (wet.unitWeight > 0) {
            weightPrice =
              Math.ceil((weightValue - wet.gt) / wet.unitWeight) * wet.price;
          } else {
            weightPrice = wet.price;
          }
        }
      }
      totalPrice += weightPrice;

      // ???????????????????????????
      const now = new Date();
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const time = now.valueOf() - startDate.valueOf();
      for (const tim of rule.time) {
        if (time > parseInt(tim.gt) && time <= parseInt(tim.lte)) {
          timePrice = tim.price;
        }
      }
      totalPrice += timePrice;
    }

    // ?????????
    if (userCouponId) {
      const userCoupon = await this.couponService.userCouponFindById(
        userCouponId,
        this.ctx.userInfo.userNo
      );
      if (!userCoupon) {
        throw new DefaultError('??????????????????');
      }
      if (userCoupon.isUse === 1) {
        throw new DefaultError('??????????????????');
      }
      if (
        userCoupon.deadlineTime !== '-1' &&
        parseInt(userCoupon.deadlineTime) <= Date.now()
      ) {
        throw new DefaultError('??????????????????');
      }
      if (
        totalPrice >= userCoupon.discountAmount &&
        totalPrice >= userCoupon.conditionsAmount
      ) {
        totalPrice -= userCoupon.discountAmount;
        discountPrice += userCoupon.discountAmount;
        couponDiscount = userCoupon.discountAmount;
      }
    }
    let intergralPrice = 0;
    // ??????
    if (intergral) {
      //
      const intergralConfig = (await this.configService.getConfig(
        CONFIG_INTEGRAL,
        false
      )) as ConfigIntegralDTO;
      const withIntergral = intergralConfig
        ? intergralConfig.withIntegral
        : 10000;
      const amountIntergral = intergral / withIntergral;
      totalPrice -= amountIntergral;
      intergralPrice = amountIntergral;
      discountPrice += amountIntergral;
    }

    // ??????
    if (fee) {
      totalPrice += fee;
    }

    return {
      distance,
      startPrice: city.startPrice,
      totalPrice: Math.floor(totalPrice * 100) / 100,
      distancePrice: Math.floor(distancePrice * 100) / 100,
      weightPrice: Math.floor(weightPrice * 100) / 100,
      timePrice: Math.floor(timePrice * 100) / 100,
      discountPrice: Math.floor(discountPrice * 100) / 100,
      userCouponId,
      weightValue,
      weightLabel: this.getWeightLabel(weight),
      distanceLabel: this.getDistanceLabel(distance),
      serviceType,
      serviceTypeLabel: this.getServiceTypeLabel(serviceType),
      fee,
      intergralPrice,
      couponDiscount,
    };
  }

  /**
   * ????????????
   * @param from
   * @param to
   * @returns
   */
  async calculationDistance(from: string, to: string) {
    const result = await this.mapService.batchDistanceCalculation(
      from,
      to,
      'bicycling'
    );
    if (result.rows.length > 0 && result.rows[0].elements.length > 0) {
      return result.rows[0].elements[0].distance;
    } else {
      throw new DefaultError('??????????????????');
    }
  }

  /**
   * ??????????????????
   * @param weight
   */
  getWeightLabel(weight: number | number[]) {
    if (typeof weight === 'number') {
      return `${weight}??????`;
    } else if (weight[0] === 0) {
      return `${weight[1]}????????????`;
    } else {
      return `${weight[0]}~${weight[1]}??????`;
    }
  }

  /**
   * ??????????????????
   * @param distance
   */
  getDistanceLabel(distance: number) {
    if (distance >= 1000) {
      return `${Math.floor(distance / 10) / 100}??????`;
    } else {
      return `${distance}???`;
    }
  }

  /**
   * ????????????????????????
   * @param type
   * @returns
   */
  getServiceTypeLabel(type: ServerType): string {
    if (type === 'helpDeliver') {
      return '?????????';
    } else if (type === 'helpGet') {
      return '?????????';
    } else if (type === 'helpBuy') {
      return '?????????';
    } else {
      return '' as string;
    }
  }

  /**
   * ????????????????????????
   * -2????????????  -1???????????? 0.?????????  1.?????????/?????????  2.?????????/????????? 3.????????????/?????????  4.????????????'
   */
  getOrderStatus(status: number): string {
    switch (status) {
      case -2:
        return '???????????????';
      case -1:
        return '???????????????';
      case 0:
        return '?????????';
      case 1:
        return '????????????';
      case 2:
        return '??????????????????';
      case 3:
        return '????????????';
      case 4:
        return '???????????????';
    }
  }
}
