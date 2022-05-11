import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class AgentAddDTO {
  @Rule(RuleType.string().max(30).min(4).required())
  agentAccount: string;

  @Rule(RuleType.string().max(45).min(2).required())
  realName: string;

  @Rule(RuleType.string().length(11).required())
  mobileNumber: string;

  @Rule(RuleType.number())
  status: 0 | 1;
}

export class AgentUpdateDTO extends AgentAddDTO {
  @Rule(RuleType.string().length(16).required())
  agentNo: string;
}

export class AgentListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  agentAccount?: string;

  @Rule(RuleType.string())
  realName?: string;

  @Rule(RuleType.string())
  mobileNumber?: string;

  @Rule(RuleType.string())
  agentNo?: string;

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class AgentStatusDTO extends PickDto(AgentUpdateDTO, [
  'agentNo',
  'status',
]) {}

export class AgentResetPwdDTO extends PickDto(AgentUpdateDTO, ['agentNo']) {}
