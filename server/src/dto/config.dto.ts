import { Rule, RuleType } from '@midwayjs/validate';

export class AppauthUpsertDTO {
  @Rule(RuleType.string().required())
  wxAppId: string;

  @Rule(RuleType.string().required())
  wxAppSecret: string;

  @Rule(RuleType.string())
  qqAppid?: string;

  @Rule(RuleType.string())
  qqAppSecret?: string;
}

export class MapKeyDTO {
  @Rule(RuleType.string().required())
  mapKey: string;
}

export class AliDTO {
  @Rule(RuleType.string().required())
  accessKeyId: string;

  @Rule(RuleType.string().required())
  accessKeySecret: string;

  @Rule(RuleType.string().required())
  arn: string;

  @Rule(RuleType.string().required())
  ossRegion: string;

  @Rule(RuleType.string().required())
  ossBucket: string;

  @Rule(RuleType.string().required())
  smsSignName: string; // 短信签名

  @Rule(RuleType.string().required())
  smsTemplateCode: string;
}

// 概率获得的接口
export interface GetRulesProbability {
  couponNo: string;
  // 概率
  probability: number;
}

export class CouponSetDTO {
  // 新用户获得优惠券渠道打开
  @Rule(RuleType.boolean().required())
  newUserOpen: boolean;

  // 用户用优惠券编号 从数组中选一张
  @Rule(RuleType.array().required())
  newUserRules: GetRulesProbability[];

  // 分享获得优惠券渠道打开
  @Rule(RuleType.boolean().required())
  shareOpen: boolean;

  // 用户用优惠券编号 从数组中选一张
  @Rule(RuleType.array().required())
  shareUserRules: GetRulesProbability[];
}

export class AppMchDTO {
  @Rule(RuleType.string().required())
  // 微信商户号
  wxMchId: string;

  @Rule(RuleType.string().required())
  // 微信商户秘钥
  wxMchSecert: string;

  @Rule(RuleType.string().required())
  // 回调地址
  notifyUrl: string;
}

export interface NoticeKeys {
  label: string;
  key: string;
}
export class NoticeDTO {
  @Rule(RuleType.string().required())
  orderTempId: string;
  @Rule(RuleType.string().required())
  verifyTempId: string;
  @Rule(RuleType.array().required())
  orderKeys: NoticeKeys[];
  @Rule(RuleType.array().required())
  verifyKeys: NoticeKeys[];

  @Rule(RuleType.array().required())
  orderSendKeys: string[];
  @Rule(RuleType.array().required())
  verifySendKeys: string[];
}

export interface OrderCancelRule {
  // 时间范围 0~3分钟
  timeRange: number[];
  price: number;
}
export class ConfigCancelOrderDTO {
  // 用户取消规则
  @Rule(RuleType.array().required())
  userCancelRules: OrderCancelRule[];

  // 骑手取消规则
  @Rule(RuleType.array().required())
  riderCancelRules: OrderCancelRule[];

  @Rule(RuleType.array().required())
  userCancelTips: string[];

  @Rule(RuleType.array().required())
  adminCancelTips: string[];

  @Rule(RuleType.array().required())
  agentCancelTips: string[];

  @Rule(RuleType.array().required())
  riderCancelTips: string[];
}

export class ConfigOrderFeeDTO {
  //小费
  @Rule(RuleType.array().required())
  feeTips: number[];

  // 平台收取比例
  @Rule(RuleType.number().required())
  platformExtract: number;

  // 代理收取比例
  @Rule(RuleType.number().required())
  agentExtract: number;
}

export class ConfigGuideDTO {
  @Rule(RuleType.string().required())
  content: string;
}

export class ConfigCashDTO {
  @Rule(RuleType.string().required())
  minCash: number;

  @Rule(RuleType.string().required())
  maxCash: number;

  @Rule(RuleType.string().required())
  dailyCashLimit: number;
}

export class ConfigShareDTO {
  @Rule(RuleType.string().required())
  title: string;

  @Rule(RuleType.string().empty(''))
  path?: string;

  @Rule(RuleType.string().empty(''))
  imageUrl?: string;

  @Rule(RuleType.string().empty(''))
  desc?: string;
}

export class ConfigIntegralDTO {
  @Rule(RuleType.number())
  withIntegral: number;
}
