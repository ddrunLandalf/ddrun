import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

@EntityModel('users_address')
export class UserAddressEntity extends CommonBase {
  @Column({ type: 'char', length: 16, unique: true })
  addressNo: string;

  @Column({ type: 'varchar', length: 45, comment: '省' })
  province: string;

  @Column({ type: 'varchar', length: 45, comment: '市' })
  city: string;

  @Column({ type: 'varchar', length: 45, comment: '区' })
  district: string;

  @Column({ type: 'double', comment: '纬度' })
  latitude: number;

  @Column({ type: 'double', comment: '经度' })
  longitude: number;

  @Column({ type: 'varchar', length: 100, comment: '街道' })
  streetNumber: string;

  @Column({ type: 'varchar', length: 120, comment: '详细地址' })
  addressDetail: string;

  @Column({ type: 'char', length: 16 })
  userNo: string;

  @Column({ type: 'varchar', length: 45, comment: '联系人姓名' })
  contactName: string;

  @Column({ type: 'char', length: 11, comment: '联系人手机号' })
  mobileNumber: string;
}
