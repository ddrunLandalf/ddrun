import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

// 骑手实体
@EntityModel('riders')
export class RiderEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '骑手编号' })
  riderNo: string;

  @Column({ type: 'int', default: 0, comment: '状态' })
  status: 0 | 1;

  @Column({ type: 'char', length: 16, comment: '用户编号' })
  userNo: string;

  @Column({ type: 'boolean', default: false, comment: '是否开始接单' })
  startReceive: boolean;

  @Column({ type: 'char', length: 16, nullable: true, comment: '所在城市' })
  cityNo: string;
}
