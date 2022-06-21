import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

@EntityModel('citys_tag_group')
export class CitysTagGroupEntity extends CommonBase {
  @Column({ type: 'varchar', length: 45, comment: '组名' })
  groupName: string;

  @Column({ type: 'json', comment: '数组' })
  tags: string[];

  // 'admin' | 'agent'
  @Column({ type: 'varchar', length: 10, comment: '谁创建的' })
  createdBy: string;

  @Column({ type: 'char', length: 16, comment: '修改人' })
  updatedBy: string;
}
