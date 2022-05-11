import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { CashEntity } from '../entity/cash.entity';
import { BaseService } from './base.service';
import { RiderService } from './rider.service';

@Provide()
export class CashService extends BaseService {
  @InjectEntityModel(CashEntity)
  cashEntity: Repository<CashEntity>;

  @Inject()
  riderService: RiderService;
  /**
   * 判断是否可以提现
   */
  async canICash(amount: number, userNo: string) {
    const rider = await this.riderService.forIsRider();
    const totalIncomeQuery = await this.cashEntity.query(
      `select sum(riderIncome) as total from balanceSheet where riderNo='${rider.riderNo}'`
    );
    const totalIncome = parseFloat(totalIncomeQuery[0].total || 0);
    const totalCashQuery = await this.cashEntity.query(
      `select sum(amount) as total from cash where status in (0,1) and cashBy='rider' and cashByNo = '${rider.riderNo}'`
    );
    const totalCash = parseFloat(totalCashQuery[0].total || 0);
    const totalAmount = totalIncome - totalCash;
    if (amount > totalIncome - totalCash) {
      return { canICash: false, totalAmount };
    } else {
      return { canICash: true, totalAmount, riderNo: rider.riderNo };
    }
  }
}
