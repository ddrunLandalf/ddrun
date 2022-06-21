import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

/**
 * 资产分割表
 */
@EntityModel('balance_sheet')
export class BalanceSheetEntity extends Base {
  @Column({ type: 'char', length: 16, comment: '城市编号' })
  cityNo: string;

  @Column({ type: 'char', unique: true, length: 32, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'char', length: 16, comment: '代理编号' })
  agentNo: string;

  @Column({ type: 'char', length: 16, comment: '骑手编号' })
  riderNo: string;

  @Column({ type: 'char', length: 16, comment: '用户编号' })
  userNo: string;

  @Column({ type: 'double', comment: '平台收入' })
  platformIncome: number;

  @Column({ type: 'double', comment: '代理收入' })
  agentIncome: number;

  @Column({ type: 'double', comment: '骑手收入' })
  riderIncome: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '描述' })
  desc: string;

  @Column({ type: 'int', default: 0, comment: '积分' })
  integral: number;
}
