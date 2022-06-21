import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { ValuationRule } from '../interface';
import { CommonBase } from './Base';

@EntityModel('citys_valuation')
export class CitysValuationEntity extends CommonBase {
  @Column({ type: 'varchar', length: 45, comment: '规则名称' })
  ruleName: string;

  @Column({ type: 'json', comment: '规则信息' })
  ruleContext: ValuationRule;

  // 'admin' | 'agent'
  @Column({ type: 'varchar', length: 10, comment: '谁创建的' })
  createdBy: string;

  @Column({ type: 'char', length: 16, comment: '修改人' })
  updatedBy: string;
}
