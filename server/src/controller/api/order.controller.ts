import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import { CONFIG_ORDER_CANCEL } from '../../constant';
import { SelectCommonDTO } from '../../dto/common.dto';
import {
  OrderDetailDTO,
  OrderDetailRiderDTO,
  OrderListByRider,
  OrderPublishDTO,
} from '../../dto/order.dto';
import { RiderOptOrderCancelDTO, RiderOptOrderDTO } from '../../dto/rider.dto';
import { OrderEntity } from '../../entity/orders.entity';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { ConfigService } from '../../service/config.service';
import { OrderService } from '../../service/order.service';
import { QueryService } from '../../service/query.service';
import { RiderService } from '../../service/rider.service';
import { UserAddressService } from '../../service/userAddress.service';
import { WxappService } from '../../service/wxapp.service';
import { BaseController } from '../base.controller';

@Controller('/api/order')
export class UserOrderController extends BaseController {
  @Inject()
  orderService: OrderService;

  @Inject()
  wxappService: WxappService;

  @Inject()
  userAddressService: UserAddressService;

  @Inject()
  queryService: QueryService;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  riderService: RiderService;

  @Inject()
  configService: ConfigService;

  @Get('/pay/callback')
  async payCallback() {
    console.log(233);
  }

  /**
   * 订单详情
   * @param dto
   * @returns
   */
  @Get('/detail', { middleware: [AppMiddleware] })
  @Validate()
  async getDetail(@Query() dto: OrderDetailDTO) {
    const result = await this.orderService.findByNo(dto.orderNo);
    if (!result) {
      throw new DefaultError('订单不存在');
    }
    return this.responseSuccess(
      'ok',
      Object.assign(result, {
        statusLabel: this.orderService.getOrderStatus(result.status),
        serviceLabel: this.orderService.getServiceTypeLabel(result.serviceType),
        distanceLabel: this.orderService.getDistanceLabel(result.distance),
        weightLabel: this.orderService.getWeightLabel(result.weight),
      })
    );
  }

  /**
   * 发起订单
   * @param dto
   * @returns
   */
  @Post('/publish', { middleware: [AppMiddleware] })
  @Validate()
  async publish(@Body() dto: OrderPublishDTO) {
    const calculateResult = await this.orderService.calculationPrice(dto);
    const result = await this.orderService.add(calculateResult, {
      startAddress: dto.startAddress,
      endAddress: dto.endAddress,
      goodsDesc: dto.goodsDesc,
    });
    /* 调起支付
    const pay = await this.wxappService.payUnifiedorder(
      result,
      calculateResult.totalPrice,
      calculateResult.serviceTypeLabel
    );
    */
    if (dto.startAddress) {
      this.userAddressService.add(dto.startAddress);
    }
    this.userAddressService.add(dto.endAddress);
    return this.responseSuccess('ok', { orderNo: result });
  }

  /**
   * 计算价格
   * @param dto
   * @returns
   */
  @Post('/calculation', { middleware: [AppMiddleware] })
  @Validate()
  async calculation(@Body() dto: OrderPublishDTO) {
    const calculateResult = await this.orderService.calculationPrice(dto);
    return this.responseSuccess('ok', calculateResult);
  }

  /**
   * 获取已完成的订单
   * @param dto
   * @returns
   */
  @Get('/list', { middleware: [AppMiddleware] })
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const result = await this.queryService.select(
      this.orderService.orderEntity,
      {
        tables: 'orders',
        wheres: `userNo="${this.ctx.userInfo.userNo}" and status in (-2,-1,4)`,
        order: 'updateTime desc',
        current: dto.current,
        pageSize: dto.pageSize,
      }
    );
    for (const item of result.data) {
      if (item.startAddress) {
        item.startAddress = JSON.parse(item.startAddress);
      }
      item.endAddress = JSON.parse(item.endAddress);
    }
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取进行中的订单
   * @returns
   */
  @Get('/ing', { middleware: [AppMiddleware] })
  async inProgress() {
    const result = await this.orderEntity
      .createQueryBuilder()
      .where('status in (:statuses)', { statuses: [0, 1, 2, 3] })
      .andWhere('userNo=:userNo', { userNo: this.ctx.userInfo.userNo })
      .orderBy('updateTime', 'DESC')
      .getMany();

    return this.responseSuccess('ok', result);
  }

  @Get('/detail/rider', { middleware: [AppMiddleware] })
  @Validate()
  async getRiderInfo(@Query() dto: OrderDetailRiderDTO) {
    const result = await this.orderService.orderEntity.query(
      `SELECT d.realname,u.mobileNumber,u.avatarUrl,u.nickName FROM users u, riders r,riderRegister d where d.userNo=u.userNo and u.userNo=r.userNo and r.riderNo='${dto.riderNo}'`
    );
    if (result.length === 0) {
      throw new DefaultError('骑手不存在');
    }
    return this.responseSuccess('ok', result[0]);
  }

  /**
   * 骑手获取订单
   * @param dto
   * @returns
   */
  @Get('/list/rider', { middleware: [AppMiddleware] })
  @Validate()
  async getListByRider(@Query() dto: OrderListByRider) {
    const rider = await this.orderService.riderService.riderEntity.findOne({
      where: { userNo: this.ctx.userInfo.userNo },
    });
    if (!rider) {
      throw new DefaultError('骑手不存在');
    }
    let wheres = '';
    if (dto.status === 'wait') {
      wheres = 'riderNo is null and status = 1';
    } else if (dto.status === 'sending') {
      wheres = `riderNo = '${rider.riderNo}' and status in (2,3)`;
    } else if (dto.status === 'all') {
      wheres = `riderNo = '${rider.riderNo}' and status in (-2,-1,4)`;
    }
    // const
    const result = await this.queryService.select(
      this.orderService.orderEntity,
      {
        tables: 'orders',
        wheres,
        order: 'createTime desc',
        current: dto.current,
        pageSize: dto.pageSize,
      }
    );
    for (const item of result.data) {
      if (item.startAddress) {
        item.startAddress = JSON.parse(item.startAddress);
      }
      item.endAddress = JSON.parse(item.endAddress);
    }
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取分配给骑手的订单
   */
  @Get('/list/byrider', { middleware: [AppMiddleware] })
  @Validate()
  async getByRider() {
    const rider = await this.orderService.riderService.riderEntity.findOne({
      where: { userNo: this.ctx.userInfo.userNo },
    });
    if (!rider) {
      throw new DefaultError('骑手不存在');
    }
    const result = (await this.orderEntity
      .createQueryBuilder()
      .where(`riderNo = '${rider.riderNo}' and status = 1`)
      .orderBy('createTime', 'DESC')
      .getMany()) as any;
    for (const item of result) {
      if (item.startAddress) {
        item.startAddress = JSON.parse(item.startAddress);
      }
      item.endAddress = JSON.parse(item.endAddress);
    }
    return this.responseSuccess('ok', result);
  }

  @Put('/receive', { middleware: [AppMiddleware] })
  @Validate()
  async reveive(@Body() dto: RiderOptOrderDTO) {
    const rider = await this.riderService.forIsRider();
    await this.orderService.orderReceive({
      riderNo: rider.riderNo,
      orderNo: dto.orderNo,
    });
    return this.responseSuccess('ok');
  }

  @Put('/deliver', { middleware: [AppMiddleware] })
  async sending(@Body() dto: RiderOptOrderDTO) {
    const rider = await this.riderService.forIsRider();
    await this.orderService.orderDeliver(dto.orderNo, rider.riderNo);
    return this.responseSuccess('ok');
  }

  @Put('/complete', { middleware: [AppMiddleware] })
  async complete(@Body() dto: RiderOptOrderDTO) {
    const rider = await this.riderService.forIsRider();
    await this.orderService.orderComplete(dto.orderNo, 'rider', rider.riderNo);
    return this.responseSuccess('ok');
  }

  @Put('/complete/user', { middleware: [AppMiddleware] })
  async completeByUser(@Body() dto: RiderOptOrderDTO) {
    await this.orderService.orderComplete(
      dto.orderNo,
      'user',
      this.ctx.userInfo.userNo
    );
    return this.responseSuccess('ok');
  }

  @Put('/cancel/rider', { middleware: [AppMiddleware] })
  async cancelByRider(@Body() dto: RiderOptOrderCancelDTO) {
    const rider = await this.riderService.forIsRider();
    await this.orderService.orderCancel(
      {
        orderNo: dto.orderNo,
        cancelReason: dto.cancelReason,
      },
      'rider',
      rider.riderNo
    );
    return this.responseSuccess('ok');
  }

  @Put('/cancel', { middleware: [AppMiddleware] })
  async cancelByUser(@Body() dto: RiderOptOrderCancelDTO) {
    await this.orderService.orderCancel(
      {
        orderNo: dto.orderNo,
        cancelReason: dto.cancelReason,
      },
      'user',
      this.ctx.userInfo.userNo
    );
    return this.responseSuccess('ok');
  }

  @Get('/reason/info')
  async getReasonInfo() {
    const config = await this.configService.getConfig(CONFIG_ORDER_CANCEL);
    return this.responseSuccess('ok', config);
  }
}
