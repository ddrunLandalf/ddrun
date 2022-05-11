import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Address } from '../dto/order.dto';
import {
  OrderCompleteBy,
  OrderType,
  PayType,
  RefundStatus,
  ServerType,
} from '../interface';
import { Base } from './Base';

@EntityModel('orders')
export class OrderEntity extends Base {
  @Column({ type: 'varchar', length: 32, unique: true, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'double', comment: '支付金额' })
  payAmount: number;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: '支付类型' })
  payType: PayType;

  @Column({ type: 'varchar', length: 20, comment: '服务类型' })
  serviceType: ServerType;

  @Column({ type: 'double', default: 0, comment: '时段配送金额' })
  timePrice: number;

  @Column({ type: 'double', default: 0, comment: '路程金额' })
  distancePrice: number;

  @Column({ type: 'double', default: 0, comment: '重量金额' })
  weightPrice: number;

  @Column({ type: 'double', default: 0, comment: '时段配送金额' })
  startPrice: number;

  @Column({ type: 'int', default: 0, comment: '路程' })
  distance: number;

  @Column({ type: 'int', default: 0, comment: '重量' })
  weight: number;

  @Column({ type: 'int', nullable: true, comment: '优惠券id' })
  userCouponId: number;

  @Column({ type: 'double', default: 0, comment: '优惠券优惠金额' })
  couponDiscount: number;

  @Column({ type: 'double', default: 0, comment: '优惠总金额' })
  discountPrice: number;

  @Column({ type: 'int', default: 0, comment: '订单状态' })
  status: OrderType;

  @Column({ type: 'json', nullable: true, comment: '起步地址' })
  startAddress: Address;

  @Column({ type: 'json', comment: '结束地址' })
  endAddress: Address;

  @Column({ type: 'varchar', length: 200, comment: '物品描述' })
  goodsDesc: string;

  @Column({ type: 'varchar', length: 16, comment: '用户' })
  userNo: string;

  @Column({ type: 'double', default: 0, comment: '退款金额' })
  refundAmount: number;

  @Column({ type: 'int', default: 0, comment: '退款状态' })
  refundStatus: RefundStatus;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '取消理由' })
  cancelReason: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '由谁取消' })
  cancelBy: OrderCompleteBy;

  @Column({ type: 'char', length: 16, nullable: true, comment: '由谁取消编号' })
  cancelByNo: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
    unique: true,
    comment: '退款单号',
  })
  refundNo: string;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '支付时间' })
  payTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '接单时间' })
  sendTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '送完时间' })
  getTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '确认成功时间',
  })
  successTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '交易关闭时间',
  })
  closeTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '取消订单时间',
  })
  cancelTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '退款时间' })
  refundTime: Date;

  @Column({ type: 'char', length: 16, nullable: true, comment: '骑手编号' })
  riderNo: string;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: '城市' })
  city: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '由谁点击完成 plateform or agent or system or user or rider',
  })
  completeBy: OrderCompleteBy;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: '由谁点击完成',
  })
  completeByNo: string;

  @Column({
    type: 'int',
    default: 0,
    comment: '小费',
  })
  fee: number;

  @Column({
    type: 'int',
    default: 0,
    comment: '积分',
  })
  intergal: number;

  @Column({ type: 'double', default: 0, comment: '积分抵扣' })
  intergalDiscount: number;
}
