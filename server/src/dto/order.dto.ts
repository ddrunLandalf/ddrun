import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { OrderType, ServerType } from '../interface';
import { SelectCommonDTO } from './common.dto';

export interface Address {
  addressNo?: string;
  province: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  streetNumber: string;
  addressDetail: string;
  contactName: string;
  mobileNumber: string;
}
export class OrderPublishDTO {
  @Rule(RuleType.object())
  startAddress?: Address;

  @Rule(RuleType.object().required())
  endAddress: Address;

  @Rule(RuleType.string().required())
  serviceType: ServerType;

  @Rule(RuleType.string().min(1).max(200).required())
  goodsDesc: string;

  @Rule(RuleType.any().required())
  weight: number | number[];

  @Rule(RuleType.number())
  userCouponId?: number;

  @Rule(RuleType.number())
  fee?: number;

  @Rule(RuleType.number())
  intergral?: number;
}

export class OrderDetailDTO {
  @Rule(RuleType.string().required())
  orderNo: string;
}

export class OrderDetailRiderDTO {
  @Rule(RuleType.string().required())
  riderNo: string;
}

export class orderListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  orderNo?: string;

  @Rule(RuleType.string())
  userNo?: string;

  @Rule(RuleType.string())
  mobileNumber?: string;

  @Rule(RuleType.string())
  riderNo?: string;

  @Rule(RuleType.number())
  status?: OrderType;

  @Rule(RuleType.string())
  city?: string;
}

export class OrderReceiveDTO {
  @Rule(RuleType.string().required())
  orderNo: string;
  @Rule(RuleType.string().required())
  riderNo: string;
}

export class OrderDeliverDTO extends PickDto(OrderReceiveDTO, ['orderNo']) {}

export class OrderCancelDTO extends PickDto(OrderReceiveDTO, ['orderNo']) {
  @Rule(RuleType.string())
  cancelReason?: string;
}

export class OrderCapitalTrendListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  orderNo?: string;

  @Rule(RuleType.string())
  riderNo?: string;

  @Rule(RuleType.string())
  agentNo?: string;

  @Rule(RuleType.string().empty(''))
  desc?: string;
}

export class OrderListByRider extends SelectCommonDTO {
  @Rule(RuleType.string())
  status: string;
}
