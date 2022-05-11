import { Rule, RuleType } from '@midwayjs/validate';

export class SelectCommonDTO {
  @Rule(RuleType.number().default(1))
  current?: number;

  @Rule(RuleType.number().default(10))
  pageSize?: number;
}
