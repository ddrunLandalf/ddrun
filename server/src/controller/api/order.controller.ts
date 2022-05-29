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
import { CONFIG_APPMCH, CONFIG_ORDER_CANCEL } from '../../constant';
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
import { js2xml } from 'xml-js';
import { WxService } from '../../service/wx.service';
import { AppMchDTO } from '../../dto/config.dto';
import { createHash, createDecipheriv } from 'crypto';

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

  @Inject()
  wxService: WxService;

  @Post('/pay/callback')
  async payCallback(@Body() body) {
    const data = ((await this.wxService.xml2JSON(body)) as any).xml;
    if (data.return_code[0] === 'SUCCESS') {
      const order = await this.orderService.findByNo(data.out_trade_no[0]);
      if (order.status === 0) {
        await this.orderService.orderEntity.update(
          {
            orderNo: data.out_trade_no[0],
            status: 0,
          },
          {
            status: 1,
            payTime: new Date(),
            payType: 'wxpay',
          }
        );
      }
    }
    return js2xml({
      return_code: 'SUCCESS',
      return_msg: 'OK',
    });
  }

  @Post('/refund/callback')
  async refundCallback(@Body() body) {
    const data = ((await this.wxService.xml2JSON(body)) as any).xml;

    if (data.return_code[0] === 'SUCCESS') {
      const config = (await this.configService.getConfig(
        CONFIG_APPMCH
      )) as AppMchDTO;
      const md5key = createHash('md5')
        .update(config.wxMchSecert)
        .digest('hex')
        .toLowerCase();
      const decipher = createDecipheriv('aes-256-ecb', md5key, Buffer.alloc(0));
      decipher.setAutoPadding(true);
      let str = decipher.update(data.req_info[0], 'base64', 'utf8');
      str += decipher.final('utf8');
      const json = ((await this.wxService.xml2JSON(str)) as any).root;
      await this.orderService.orderEntity.update(
        {
          orderNo: json.out_trade_no[0],
        },
        {
          status: -2,
          refundStatus: 1,
          refundNo: json.out_refund_no[0],
          refundTime: new Date(),
          refundAmount: Math.floor(parseInt(json.refund_fee[0])) / 100,
        }
      );
    }
    return js2xml({
      return_code: 'SUCCESS',
      return_msg: 'OK',
    });
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
      status: 0,
    });
    let returnParams = {} as any;
    // 调起支付
    const pay = await this.wxappService.payUnifiedorder(
      result,
      calculateResult.totalPrice,
      calculateResult.serviceTypeLabel
    );
    if (pay.return_code[0] !== 'SUCCESS') {
      throw new DefaultError(pay.return_msg[0]);
    }
    const mch = (await this.configService.getConfig(
      CONFIG_APPMCH
    )) as AppMchDTO;
    const timeStamp = Date.now() + '';
    const paySign = this.wxService.paysign2(
      pay.appid[0],
      timeStamp,
      pay.nonce_str[0],
      'prepay_id=' + pay.prepay_id[0],
      mch.wxMchSecert
    );
    returnParams = {
      orderNo: result,
      nonce_str: pay.nonce_str[0],
      sign: pay.sign[0],
      paySign,
      timeStamp,
      prepay_id: pay.prepay_id[0],
      trade_type: pay.trade_type[0],
    };
    if (dto.startAddress) {
      this.userAddressService.add(dto.startAddress);
    }
    this.userAddressService.add(dto.endAddress);
    return this.responseSuccess('ok', returnParams);
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
