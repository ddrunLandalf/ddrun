import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('users')
export class UserEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '用户编号' })
  userNo: string;

  @Column({ type: 'varchar', length: 10, default: '86', comment: '国家代码' })
  countryCode: string;

  @Column({ type: 'varchar', length: 11, unique: true, comment: '手机号' })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '头像' })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 45, comment: '昵称' })
  nickName: string;

  @Column({ type: 'int', default: 0, comment: '性别 0未知，1男 2女' })
  gender: 0 | 1 | 2;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: '省' })
  province: string;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: '市' })
  city: string;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: '区' })
  area: string;

  @Column({ type: 'int', default: 1, comment: '状态 0禁用 1启用' })
  status: 0 | 1;

  @Column({ type: 'char', length: 16, nullable: true, comment: '家地址' })
  homeAddressNo: string;

  @Column({ type: 'char', length: 16, nullable: true, comment: '公司地址' })
  companyAddressNo: string;
}
