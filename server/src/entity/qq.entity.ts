import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('qqapp')
export class QQappEntity extends Base {
  @Column({ type: 'char', length: 32, unique: true, comment: 'qq用户编号' })
  qqappNo: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  openid: string;

  @Column({ type: 'char', length: 16, nullable: true })
  userNo: string;
}
