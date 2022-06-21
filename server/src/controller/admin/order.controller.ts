import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  OrderCancelDTO,
  OrderCapitalTrendListDTO,
  OrderDeliverDTO,
  orderListDTO,
  OrderReceiveDTO,
} from '../../dto/order.dto';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { OrderService } from '../../service/order.service';
import { QueryService } from '../../service/query.service';
import { RiderService } from '../../service/rider.service';
import { BaseController } from '../base.controller';

@Controller('/admin/order', { middleware: [AdminMiddleware] })
export class AdminOrderController extends BaseController {
  @Inject()
  queryService: QueryService;

  @Inject()
  orderReceive: OrderService;

  @Inject()
  riderService: RiderService;

  @Get('/list')
  @Validate()
  async list(@Query() dto: orderListDTO) {
    const tables = 'orders ord, users u';
    const fields = 'ord.*, u.nickName, u.mobileNumber,u.avatarUrl';
    let wheres = 'ord.userNo = u.userNo';
    if (dto.mobileNumber) {
      wheres += ` and u.mobileNumber like "%${dto.mobileNumber}%"`;
    }
    if (dto.orderNo) {
      wheres += ` and ord.orderNo = "${dto.orderNo}"`;
    }
    if (dto.riderNo) {
      wheres += ` and ord.riderNo = "${dto.riderNo}"`;
    }
    if (dto.userNo) {
      wheres += ` and ord.userNo = "${dto.userNo}"`;
    }
    if (dto.status !== undefined) {
      wheres += ` and ord.status = ${dto.status}`;
    }
    if (dto.city) {
      wheres += ` and ord.status like "%${dto.city}%"`;
    }
    const result = await this.queryService.select(
      this.orderReceive.orderEntity,
      {
        tables,
        fields,
        wheres,
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'ord.createTime desc',
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

  @Put('/receive')
  @Validate()
  async receive(@Body() dto: OrderReceiveDTO) {
    await this.orderReceive.orderReceive(dto);
    return this.responseSuccess('接单成功');
  }

  @Put('/deliver')
  @Validate()
  async deliver(@Body() dto: OrderReceiveDTO) {
    await this.orderReceive.orderDeliver(dto.orderNo, dto.riderNo);
    return this.responseSuccess('配送完成');
  }

  @Put('/complete')
  @Validate()
  async orderComplete(@Body() dto: OrderDeliverDTO) {
    await this.orderReceive.orderComplete(
      dto.orderNo,
      'admin',
      this.ctx.adminInfo.adminNo
    );
    return this.responseSuccess('订单完成');
  }

  @Put('/cancel')
  @Validate()
  async orderCancel(@Body() dto: OrderCancelDTO) {
    await this.orderReceive.orderCancel(
      dto,
      'admin',
      this.ctx.adminInfo.adminNo
    );
    return this.responseSuccess('订单已取消');
  }

  /**
   * 资金走向列表
   */
  @Get('/capitaltrend/list')
  @Validate()
  async capitalTrendList(@Query() dto: OrderCapitalTrendListDTO) {
    let wheres = '';
    if (dto.agentNo) {
      wheres = `bs.agentNo="${dto.agentNo}"`;
    }
    if (dto.desc) {
      wheres = `${wheres ? ' and ' : ''} bs.desc like "%${dto.desc}%"`;
    }
    if (dto.orderNo) {
      wheres = `${wheres ? ' and ' : ''} bs.orderNo = "${dto.orderNo}"`;
    }
    if (dto.riderNo) {
      wheres = `${wheres ? ' and ' : ''} bs.riderNo = "${dto.riderNo}"`;
    }
    const result = await this.queryService.select(
      this.orderReceive.orderEntity,
      {
        tables: 'balance_sheet bs',
        wheres,
        order: 'bs.createTime desc',
        current: dto.current,
        pageSize: dto.pageSize,
      }
    );

    return this.responseSuccess('ok', result);
  }
}
