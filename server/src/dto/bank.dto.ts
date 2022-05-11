import { PickDto, Rule, RuleType } from '@midwayjs/validate';

export class BankAddDTO {
  @Rule(RuleType.string())
  cardNo: string;

  @Rule(RuleType.string())
  realname: string;

  @Rule(RuleType.string())
  bankName: string;
}

export class BankUpdateDTO extends BankAddDTO {
  @Rule(RuleType.string())
  bankNo: string;
}

export class BankDelDTO extends PickDto(BankUpdateDTO, ['bankNo']) {}
