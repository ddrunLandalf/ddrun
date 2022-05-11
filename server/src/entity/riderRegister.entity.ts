import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('riderRegister')
export class RiderRegisterEntity extends Base {
  @Column({ type: 'varchar', length: 45, comment: '真实姓名' })
  realname: string;

  @Column({ type: 'char', length: 18, comment: '身份证号码' })
  idCardNo: string;

  @Column({ type: 'varchar', length: 200, comment: '头像一面的身份证照片' })
  avatarFaceImage: string;

  @Column({ type: 'varchar', length: 200, comment: '国徽一面的身份证照片' })
  nationalFaceImage: string;

  @Column({ type: 'int', default: 0, comment: '0审核中 1通过 2拒绝' })
  status: 0 | 1 | 2;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '拒绝理由' })
  refuseReason: string;

  @Column({ type: 'char', length: 16, unique: true })
  userNo: string;
}
