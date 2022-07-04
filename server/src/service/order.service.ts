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
   * 取消订单
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
        throw new DefaultError('订单不存在');
      }
      if (order.status === -1) {
        throw new DefaultError('订单已关闭');
      } else if (order.status === -2) {
        throw new DefaultError('订单已取消');
      } else if (order.status === 3) {
        throw new DefaultError('已配送完成');
      } else if (order.status === 4) {
        throw new DefaultError('订单已完成');
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
        throw new DefaultError('订单取消成功');
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
          throw new DefaultError('恢复优惠券失败');
        }
      }
      order.status = -2;
      /**
       * 发送订阅消息通知
       */
      this.subscribeService.orderStatusChangeNoticeSend(order);
      return true;
    });
  }

  /**
   * 退款
   */
  async orderRefund(order: OrderEntity, cancelBy: OrderCompleteBy) {
    if (order.status === 1 || order.status === 2) {
      // 执行退款
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
          // 用户取消退款
          // 已过去的时间
          desc = '用户取消订单退款';
          const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
          for (const item of cancelConfig.userCancelRules) {
            if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
              platformIncome =
                Math.floor(
                  Math.round((order.payAmount - order.fee) * item.price * 100)
                ) / 100;
              desc += `,取消时间在${item.timeRange[0]}~${
                item.timeRange[1]
              }范围内，需承担${Math.floor(item.price * 100)}%的费用`;
              break;
            }
          }
          refundFee -= platformIncome;
        } else if (order.status === 2 && cancelBy === 'rider') {
          desc = '骑手取消订单';
          const overtime = (Date.now() - order.sendTime.valueOf()) / 1000;
          for (const item of cancelConfig.riderCancelRules) {
            if (overtime > item.timeRange[0] && overtime <= item.timeRange[1]) {
              riderReduce = Math.floor(
                Math.round((order.payAmount - order.fee) * item.price)
              );
              platformIncome = riderReduce;
              desc += `,取消时间在${item.timeRange[0]}~${
                item.timeRange[1]
              }范围内，全额退款，并承担${Math.floor(
                item.price * 100
              )}%的违约费用`;
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
            throw new DefaultError('资产分割失败');
          }
        }
      }

      /** 以下执行退款 */
      if (refundFee > 0) {
        await this.wxappService.refund(
          order.orderNo,
          order.payAmount,
          refundFee,
          order.cancelReason
        );
      }
      /** 以上执行退款 */

      return refundFee;
    }
    return 0;
  }

  /**
   * 关闭订单
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
   * 接单
   * @param param0
   */
  async orderReceive(dto: OrderReceiveDTO) {
    return await this.orderEntity.manager.transaction(
      async (entity: EntityManager) => {
        const rider = await this.riderService.riderEntity.findOne({
          where: { riderNo: dto.riderNo },
        });
        if (!rider) {
          throw new DefaultError('骑手不存在');
        }
        if (rider.status === 0) {
          throw new DefaultError('骑手不可用');
        }
        if (!rider.startReceive) {
          throw new DefaultError('骑手已暂停接单');
        }
        const order = await this.orderEntity.findOne({
          where: { orderNo: dto.orderNo },
          transaction: true,
        });
        if (!order) {
          throw new DefaultError('订单不存在');
        }
        if (order.status === 0) {
          throw new DefaultError('订单还没支付');
        } else if (order.status === -1) {
          throw new DefaultError('订单已关闭');
        } else if (order.status === -2) {
          throw new DefaultError('订单已取消');
        } else if (order.status === 2) {
          throw new DefaultError('已被接单');
        } else if (order.status === 3) {
          throw new DefaultError('已配送完成');
        } else if (order.status === 4) {
          throw new DefaultError('订单已完成');
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
          throw new DefaultError('接单失败');
        }
        order.status = 2;
        /**
         * 发送订阅消息通知
         */
        this.subscribeService.orderStatusChangeNoticeSend(order);
        return true;
      }
    );
  }

  /**
   * 配送完成
   */
  async orderDeliver(orderNo: string, riderNo: string) {
    const order = await this.orderEntity.findOne({
      where: { orderNo },
    });
    if (!order) {
      throw new DefaultError('订单不存在');
    }
    if (order.status === 0) {
      throw new DefaultError('订单还没支付');
    } else if (order.status === -1) {
      throw new DefaultError('订单已关闭');
    } else if (order.status === -2) {
      throw new DefaultError('订单已取消');
    } else if (order.status === 1) {
      throw new DefaultError('还未接单');
    } else if (order.status === 3) {
      throw new DefaultError('已配送完成');
    } else if (order.status === 4) {
      throw new DefaultError('订单已完成');
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
      throw new DefaultError('配送完成失败');
    }
    await this.queueService.execute(
      OrderAutoToCompleteTask,
      { orderNo },
      { delay: ORDER_COMPLETE_DELAY }
    );
    order.status = 3;

    /**
     * 发送订阅消息通知
     */
    this.subscribeService.orderStatusChangeNoticeSend(order);
  }

  /**
   * 点击完成
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
          throw new DefaultError('订单不存在');
        }
        if (order.status === 0) {
          throw new DefaultError('订单还没支付');
        } else if (order.status === -1) {
          throw new DefaultError('订单已关闭');
        } else if (order.status === -2) {
          throw new DefaultError('订单已取消');
        } else if (order.status === 1) {
          throw new DefaultError('还未接单');
        } else if (order.status === 2) {
          throw new DefaultError('还没有配送完成');
        } else if (order.status === 4) {
          throw new DefaultError('订单已完成');
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
          throw new DefaultError('完成失败');
        }

        // 与 骑手 平台 代理 分资产
        await this.assetsPartition(order);
        return true;
      }
    );
  }

  /**
   * 资产分割
   * @param order
   */
  async assetsPartition(order: OrderEntity) {
    const city = await this.cityService.citysEntity.findOne({
      where: { cityName: order.city },
      transaction: true,
    });
    if (!city) {
      throw new DefaultError('城市不存在');
    }
    // 除去优惠的总价
    const totalPrice = order.discountPrice + order.payAmount - order.fee;
    // 平台收入
    let platformIncome = 0;
    // 代理收入
    let agentIncome = 0;
    // 骑手小费
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

    /**以下为小费配置 */
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
      desc += `;小费P:${Math.floor(
        feeConfig.platformExtract * 100
      )}%-A:${Math.floor(feeConfig.agentExtract * 100)}%-R:${riderFee}元`;
    }
    /**以上为小费配置 */

    platformIncome = Math.floor(Math.round(platformIncome * 100)) / 100;
    agentIncome = Math.floor(Math.round(agentIncome * 100)) / 100;

    //骑手收入
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
      throw new DefaultError('资产分割失败');
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
        // 以下参数测试用
        status: status || 0,
        city: endAddress.city,
        fee: params.fee,
        intergalDiscount: params.intergralPrice,
      });
      if (!add.raw.insertId) {
        throw new DefaultError('创建订单失败');
      }
      if (params.userCouponId) {
        await this.couponService.writeOffCoupon(params.userCouponId);
      }
      return orderNo;
    });
    return result;
  }

  /**
   * 计算价格
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
    // 距离
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
      // 如果是范围
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
      throw new DefaultError('该城市暂未开通服务');
    }
    totalPrice += city.startPrice;

    // 根据计价规则计价
    if (city.citysValuationId) {
      const valuation = await this.valuationEntity.findOne({
        where: { id: city.citysValuationId },
      });
      const rule = valuation.ruleContext;
      // 计算距离产生的价格
      for (const dtans of rule.distance) {
        if (distance > dtans.gt * 1000 && distance <= dtans.lte * 1000) {
          // 若距离在此范围内
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
      // 计算重量产生的价格
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

      // 计算时间产生的价格
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

    // 优惠券
    if (userCouponId) {
      const userCoupon = await this.couponService.userCouponFindById(
        userCouponId,
        this.ctx.userInfo.userNo
      );
      if (!userCoupon) {
        throw new DefaultError('优惠券不存在');
      }
      if (userCoupon.isUse === 1) {
        throw new DefaultError('优惠券已使用');
      }
      if (
        userCoupon.deadlineTime !== '-1' &&
        parseInt(userCoupon.deadlineTime) <= Date.now()
      ) {
        throw new DefaultError('优惠券已过期');
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
    // 积分
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

    // 小费
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
   * 计算距离
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
      throw new DefaultError('距离计算有误');
    }
  }

  /**
   * 获取重量标签
   * @param weight
   */
  getWeightLabel(weight: number | number[]) {
    if (typeof weight === 'number') {
      return `${weight}公斤`;
    } else if (weight[0] === 0) {
      return `${weight[1]}公斤以内`;
    } else {
      return `${weight[0]}~${weight[1]}公斤`;
    }
  }

  /**
   * 获取距离标签
   * @param distance
   */
  getDistanceLabel(distance: number) {
    if (distance >= 1000) {
      return `${Math.floor(distance / 10) / 100}公里`;
    } else {
      return `${distance}米`;
    }
  }

  /**
   * 获取服务类型标签
   * @param type
   * @returns
   */
  getServiceTypeLabel(type: ServerType): string {
    if (type === 'helpDeliver') {
      return '帮我送';
    } else if (type === 'helpGet') {
      return '帮我取';
    } else if (type === 'helpBuy') {
      return '帮我买';
    } else {
      return '' as string;
    }
  }

  /**
   * 获取订单状态标签
   * -2取消订单  -1交易关闭 0.待付款  1.已支付/待接单  2.已接单/配送中 3.配送完成/待确认  4.确认完成'
   */
  getOrderStatus(status: number): string {
    switch (status) {
      case -2:
        return '订单已取消';
      case -1:
        return '订单已关闭';
      case 0:
        return '待付款';
      case 1:
        return '等待接单';
      case 2:
        return '订单正在配送';
      case 3:
        return '等待确认';
      case 4:
        return '订单已完成';
    }
  }
}
