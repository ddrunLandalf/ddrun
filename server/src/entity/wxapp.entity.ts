import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('wxapp')
export class WxappEntity extends Base {
  @Column({ type: 'char', length: 32, unique: true, comment: '微信用户编号' })
  wxappNo: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  openid: string;

  @Column({ type: 'char', length: 16, nullable: true })
  userNo: string;
}
