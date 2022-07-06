import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { AnalysisDayDTO } from '../../dto/analysis.dto';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { BaseController } from '../base.controller';
const dayjs = require('dayjs');

@Controller('/admin/analysis')
export class AnalysisController extends BaseController {
  @Inject()
  orderService: OrderService;

  @Inject()
  userService: UserService;

  @Get('/total')
  async getTotalData() {
    // 用户总数
    const userTotal = await this.userService.userModel.count();
    // 订单完成总数
    const orderCompleteTotal = await this.orderService.orderEntity.count({
      where: { status: 4 },
    });
    // 总交易额
    const tradeSumSql =
      'select sum(payAmount) as value from orders where status=4';
    const tradeTotal = await this.orderService.orderEntity.query(tradeSumSql);

    // 总盈利
    const incomeTotalSql =
      'select sum(platformIncome) as value from balance_sheet';
    const incomeTotalResult = await this.orderService.orderEntity.query(
      incomeTotalSql
    );
    const incomeTotal = incomeTotalResult[0].value;

    // 昨日日期
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const dateStr = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    // 昨日用户
    const yesterdayUserSql = `SELECT count(*) as total  FROM users where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}'`;
    const yesterdayUserRes = await this.userService.userModel.query(
      yesterdayUserSql
    );

    // 昨日订单
    const yesterdayOrderCompleteSql = `SELECT count(*) as total  FROM orders where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}' and status = 4`;
    const yesterdayOrderCompleteTotal =
      await this.orderService.orderEntity.query(yesterdayOrderCompleteSql);
    // 昨日交易额
    const yesterdayTradeSumSql = `select sum(payAmount) as value from orders where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}' and status=4`;
    const yesterdayTradeSum = await await this.orderService.orderEntity.query(
      yesterdayTradeSumSql
    );

    // 昨日盈利
    const yesterdayIncomeTotalSql = `select sum(platformIncome) as value from balance_sheet where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}'`;
    const yesterdayIncomeTotalResult =
      await this.orderService.orderEntity.query(yesterdayIncomeTotalSql);
    const yesterdayIncomeTotal = yesterdayIncomeTotalResult[0].value;

    return this.responseSuccess('ok', {
      userTotal: Math.floor(Math.round(userTotal * 100)) / 100,
      orderCompleteTotal:
        Math.floor(Math.round(orderCompleteTotal * 100)) / 100,
      tradeTotal:
        tradeTotal.length > 0
          ? Math.floor(Math.round(tradeTotal[0].value * 100)) / 100
          : 0,
      incomeTotal: Math.floor(Math.round(incomeTotal * 100)) / 100,
      yesterdayUserTotal: yesterdayUserRes[0].total,
      yesterdayOrderCompleteTotal: yesterdayOrderCompleteTotal[0].total,
      yesterdayTradeTotal:
        Math.floor(Math.round(yesterdayTradeSum[0].value * 100)) / 100,
      yesterdayIncomeTotal:
        Math.floor(Math.round(yesterdayIncomeTotal * 100)) / 100,
    });
  }

  /**
   * 获取时间段内各订单状态下的订单数量
   * @param dto
   * @returns
   */
  @Get('/order/status')
  @Validate()
  async getOrderStatus(@Query() dto: AnalysisDayDTO) {
    const sql = `select count(*) as total from orders where DATE_FORMAT(createTime, '%Y%m%d') >= '${dto.beginDate}' and DATE_FORMAT(createTime, '%Y%m%d')<= '${dto.endDate}' and `;
    const [
      cancel,
      close,
      waitPay,
      waitReceive,
      sending,
      waitConfirm,
      complete,
      refund,
    ] = await Promise.all([
      this.orderService.orderEntity.query(sql + 'status=-2'),
      this.orderService.orderEntity.query(sql + 'status=-1'),
      this.orderService.orderEntity.query(sql + 'status=0'),
      this.orderService.orderEntity.query(sql + 'status=1'),
      this.orderService.orderEntity.query(sql + 'status=2'),
      this.orderService.orderEntity.query(sql + 'status=3'),
      this.orderService.orderEntity.query(sql + 'status=4'),
      this.orderService.orderEntity.query(sql + 'refundStatus=1'),
    ]);
    return this.responseSuccess('ok', {
      cancel: cancel[0].total,
      close: close[0].total,
      waitPay: waitPay[0].total,
      waitReceive: waitReceive[0].total,
      sending: sending[0].total,
      waitConfirm: waitConfirm[0].total,
      complete: complete[0].total,
      refund: refund[0].total,
    });
  }

  @Get('/new/user')
  @Validate()
  async getNewUser(@Query() dto: AnalysisDayDTO) {
    // 20220425
    const where = `where date_format(createTime, '%Y%m%d') between '${dto.beginDate}' and '${dto.endDate}' group by date_format(createTime, '%Y-%m-%d')`;
    const userCountDaily = await this.userService.userModel.query(
      `select count(*) as count, date_format(createTime, '%Y-%m-%d') as createDate FROM users ${where}`
    );
    const wxCountDaily = await this.userService.userModel.query(
      `select count(*) as count, date_format(createTime, '%Y-%m-%d') as createDate FROM wxapp ${where}`
    );
    const dates = this.getDate(dto, { wx: 0, user: 0 });

    for (const date of dates) {
      for (const item1 of userCountDaily) {
        if (date.date === item1.createDate) {
          date.user = parseInt(item1.count);
        }
      }

      for (const item2 of wxCountDaily) {
        if (date.date === item2.createDate) {
          date.wx = parseInt(item2.count);
        }
      }
    }

    return this.responseSuccess('ok', dates);
  }

  @Get('/new/order')
  @Validate()
  async getNewOrder(@Query() dto: AnalysisDayDTO) {
    const [
      cancel,
      close,
      waitPay,
      waitReceive,
      sending,
      waitConfirm,
      complete,
    ] = await Promise.all([
      this.orderService.orderEntity.query(
        this.getOrderSql(dto, 'cancelTime', -2)
      ),
      this.orderService.orderEntity.query(
        this.getOrderSql(dto, 'closeTime', -1)
      ),
      this.orderService.orderEntity.query(
        this.getOrderSql(dto, 'createTime', 0)
      ),
      this.orderService.orderEntity.query(this.getOrderSql(dto, 'payTime', 1)),
      this.orderService.orderEntity.query(this.getOrderSql(dto, 'sendTime', 2)),
      this.orderService.orderEntity.query(this.getOrderSql(dto, 'getTime', 3)),
      this.orderService.orderEntity.query(
        this.getOrderSql(dto, 'successTime', 4)
      ),
    ]);

    const dates = this.getDate(dto, {
      cancel: 0,
      close: 0,
      waitPay: 0,
      waitReceive: 0,
      sending: 0,
      waitConfirm: 0,
      complete: 0,
    });

    for (const date of dates) {
      for (const item of cancel) {
        if (date.date === item.createDate) {
          date.cancel = parseInt(item.count);
        }
      }
      for (const item of close) {
        if (date.date === item.createDate) {
          date.close = parseInt(item.count);
        }
      }
      for (const item of waitPay) {
        if (date.date === item.createDate) {
          date.waitPay = parseInt(item.count);
        }
      }
      for (const item of waitReceive) {
        if (date.date === item.createDate) {
          date.waitReceive = parseInt(item.count);
        }
      }
      for (const item of sending) {
        if (date.date === item.createDate) {
          date.sending = parseInt(item.count);
        }
      }
      for (const item of waitConfirm) {
        if (date.date === item.createDate) {
          date.waitConfirm = parseInt(item.count);
        }
      }
      for (const item of complete) {
        if (date.date === item.createDate) {
          date.complete = parseInt(item.count);
        }
      }
    }
    return this.responseSuccess('ok', dates);
  }

  getOrderSql(dto: AnalysisDayDTO, timeName: string, status: number) {
    return `select count(*) as count, date_format(${timeName}, '%Y-%m-%d') as createDate FROM orders where date_format(${timeName}, '%Y%m%d') between '${dto.beginDate}' and '${dto.endDate}' and status=${status} group by date_format(${timeName}, '%Y-%m-%d')`;
  }

  getDate(dto: AnalysisDayDTO, data: any) {
    const begin = dto.beginDate.split('');
    const beginDate = new Date();
    beginDate.setFullYear(
      parseInt(begin[0] + begin[1] + begin[2] + begin[3]),
      parseInt(begin[4] + begin[5]) - 1,
      parseInt(begin[6] + begin[7])
    );
    beginDate.setHours(0, 0, 0, 0);

    const end = dto.endDate.split('');
    const endDate = new Date();
    endDate.setFullYear(
      parseInt(end[0] + end[1] + end[2] + end[3]),
      parseInt(end[4] + end[5]) - 1,
      parseInt(end[6] + end[7])
    );
    endDate.setHours(23, 59, 59);
    const days = Math.ceil(
      (endDate.valueOf() - beginDate.valueOf()) / (24 * 60 * 60 * 1000)
    );
    const dates = [] as any[];
    for (let i = 0; i < days; i++) {
      const day = dayjs(beginDate.valueOf() + i * 24 * 60 * 60 * 1000).format(
        'YYYY-MM-DD'
      );
      dates.push(Object.assign({ date: day }, data));
    }
    return dates;
  }
}
