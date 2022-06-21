import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

export interface WeightTag {
  label: string;
  type: 'eq' | 'range';
  value: number | number[];
}

@EntityModel('citys_weight_tag')
export class CitysWeightTagEntity extends CommonBase {
  @Column({ type: 'varchar', length: 45, comment: '规则名称' })
  tagName: string;

  @Column({ type: 'json', comment: '标签数组' })
  tags: WeightTag[];

  // 'admin' | 'agent'
  @Column({ type: 'varchar', length: 10, comment: '谁创建的' })
  createdBy: string;

  @Column({ type: 'char', length: 16, comment: '修改人' })
  updatedBy: string;
}
