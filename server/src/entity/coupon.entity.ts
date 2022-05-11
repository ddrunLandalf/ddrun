import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';
import { ServerType } from '../interface';

@EntityModel('coupons')
export class CouponEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '优惠券编号' })
  couponNo: string;

  @Column({ type: 'varchar', length: 45, comment: '优惠券名称' })
  couponName: string;

  @Column({ type: 'int', comment: '过期天数 (用户领取后生效)' })
  deadlineDays: number;

  @Column({ type: 'double', comment: '优惠金额' })
  discountAmount: number;

  @Column({ type: 'double', default: 0, comment: '达到多少优惠金额可用' })
  conditionsAmount: number;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '什么类型的服务可以使用：默认全部',
  })
  conditionService: ServerType | 'ALL';

  @Column({ type: 'int', default: 0, comment: '累计领取数量' })
  cumulativeDrawNo: number;

  @Column({ type: 'int', default: 0, comment: '累计使用数量' })
  cumulativeUseNo: number;

  @Column({ type: 'int', default: -1, comment: '数量限制 -1 为不限制' })
  limitNumber: number;

  @Column({ type: 'int', comment: '状态 0.停用 1.可用' })
  status: 0 | 1;

  @Column({ type: 'char', length: 16, comment: '管理员编号' })
  updatedBy: string;
}
