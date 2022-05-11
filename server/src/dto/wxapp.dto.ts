import { Rule, RuleType } from '@midwayjs/validate';

export class WxappLoginDTO {
  @Rule(RuleType.string().required())
  code: string;
}
