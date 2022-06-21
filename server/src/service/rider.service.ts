import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BalanceSheetEntity } from '../entity/balanceSheet.entity';
import { CashEntity } from '../entity/cash.entity';
import { RiderEntity } from '../entity/rider.entity';
import { RiderRegisterEntity } from '../entity/riderRegister.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';

@Provide()
export class RiderService extends BaseService {
  @InjectEntityModel(RiderEntity)
  riderEntity: Repository<RiderEntity>;

  @InjectEntityModel(RiderRegisterEntity)
  riderRegisterEntity: Repository<RiderRegisterEntity>;

  @InjectEntityModel(BalanceSheetEntity)
  bsEntity: Repository<BalanceSheetEntity>;

  @InjectEntityModel(CashEntity)
  cashEntity: Repository<CashEntity>;

  async addRider(userNo: string) {
    const findRider = await this.riderEntity.findOne({
      where: { userNo: userNo },
    });
    if (!findRider) {
      const add = await this.riderEntity.insert({
        status: 1,
        userNo: userNo,
        riderNo: this.nanoid(16),
      });
      if (!add.raw.insertId) {
        throw new DefaultError('添加失败1');
      }
    } else {
      const update = await this.riderEntity.update(
        {
          userNo: userNo,
        },
        {
          status: 1,
        }
      );
      if (update.affected === 0) {
        throw new DefaultError('更新失败1');
      }
    }
  }
  async forIsRider() {
    const rider = await this.riderEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });
    if (!rider) {
      throw new DefaultError('骑手不存在');
    }
    if (rider.status === 0) {
      throw new DefaultError('骑手已禁用');
    }
    return rider;
  }
  /**
   * 获取资金
   */
  async getCapital(riderNo: string) {
    const bs = await this.bsEntity.query(
      `select sum(riderIncome) as income from balance_sheet where riderNo='${riderNo}'`
    );
    if (bs.length === 0) {
      throw new DefaultError('获取骑手收入失败');
    }
    // 累计收入
    const accumulatedIncome = Math.floor(Math.round(bs[0].income * 100)) / 100;
    let accumulatedCash = 0;
    try {
      const cash = await this.cashEntity.query(
        `select sum(amount) as total from cash where cashBy='rider' and cashByNo='${riderNo}' and status in (0,1)`
      );
      if (cash.length === 0) {
        throw new DefaultError('获取骑手提现失败');
      }
      // 累计提现
      accumulatedCash = Math.floor(Math.round(cash[0].total * 100)) / 100;
    } catch (error) {
      //
    }

    return {
      accumulatedIncome,
      accumulatedCash,
      balance:
        Math.floor(Math.round((accumulatedIncome - accumulatedCash) * 100)) /
        100,
    };
  }
}
