import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('citys')
export class CitysEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '代理编号' })
  cityNo: string;

  @Column({ type: 'varchar', length: 45, comment: '城市名称' })
  cityName: string;

  @Column({ type: 'varchar', length: 45, comment: '省份' })
  province: string;

  @Column({ type: 'char', length: 16, nullable: true, comment: '代理编号' })
  agentNo: string;

  @Column({
    type: 'double',
    default: 0,
    comment: '起步价',
  })
  startPrice: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '帮我送抽成',
  })
  extractHelpDeliver: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '帮我取抽成',
  })
  extractHelpGet: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '帮我买抽成',
  })
  extractHelpBuy: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '代理帮我送抽成',
  })
  extractHelpDeliverForAgent: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '代理帮我取抽成',
  })
  extractHelpGetForAgent: number;

  @Column({
    type: 'double',
    default: 0,
    comment: '代理帮我买抽成',
  })
  extractHelpBuyForAgent: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '计价规则',
  })
  citysValuationId: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '重量标签',
  })
  citysWeightTagId: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '物品标签组',
  })
  citysTagGroupId: number;

  @Column({ type: 'int', default: 0, comment: '运营状态' })
  status: 0 | 1;

  @Column({ type: 'varchar', length: 16, comment: '管理员' })
  updatedBy: string;
}
