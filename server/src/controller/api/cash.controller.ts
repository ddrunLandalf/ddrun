import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { CashRegisterDTO } from '../../dto/cash.dto';
import { SelectCommonDTO } from '../../dto/common.dto';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { CashService } from '../../service/cash.service';
import { QueryService } from '../../service/query.service';
import { RiderService } from '../../service/rider.service';
import { BaseController } from '../base.controller';

@Controller('/api/cash', { middleware: [AppMiddleware] })
export class RiderCashController extends BaseController {
  @Inject()
  cashService: CashService;

  @Inject()
  queryService: QueryService;

  @Inject()
  riderService: RiderService;
  /**
   * 申请提现
   * @param dto
   * @returns
   */
  @Post('/register')
  @Validate()
  async register(@Body() dto: CashRegisterDTO) {
    const { canICash, riderNo } = await this.cashService.canICash(
      dto.amount,
      this.ctx.userInfo.userNo
    );
    if (!canICash) {
      throw new DefaultError('提现金额大于超出账户余额，不可提现');
    }
    const res = await this.cashService.cashEntity.insert({
      cashBy: 'rider',
      cashByNo: riderNo,
      status: 0,
      amount: dto.amount,
      bankNo: dto.bankNo,
      cashNo: this.nanoid(16),
    });
    if (!res.raw.insertId) {
      throw new DefaultError('申请提现失败');
    }
    return this.responseSuccess('提现申请已提交');
  }

  /**
   * 余额
   * @returns
   */
  @Get('/blance')
  async getBlanceAmount() {
    const { totalAmount } = await this.cashService.canICash(
      100,
      this.ctx.userInfo.userNo
    );
    return this.responseSuccess(
      'ok',
      Math.floor(Math.round(totalAmount * 100)) / 100
    );
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const rider = await this.riderService.forIsRider();
    const result = await this.queryService.select(this.cashService.cashEntity, {
      tables: 'cash',
      wheres: `cashBy='rider' and cashByNo='${rider.riderNo}'`,
      current: dto.current,
      pageSize: dto.pageSize,
      order: 'createTime desc',
    });
    return this.responseSuccess('ok', result);
  }
}
