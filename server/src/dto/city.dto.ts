import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { WeightTag } from '../entity/citysWeightTag.entity';
import { ValuationRule } from '../interface';
import { SelectCommonDTO } from './common.dto';

export class CityAddDTO {
  @Rule(RuleType.string().required())
  cityName: string;

  @Rule(RuleType.string().required())
  province: string;

  @Rule(RuleType.string().length(16))
  agentNo?: string;

  @Rule(RuleType.number())
  startPrice?: number;

  @Rule(RuleType.number())
  extractHelpDeliver: number;

  @Rule(RuleType.number())
  extractHelpGet: number;

  @Rule(RuleType.number())
  extractHelpBuy: number;

  @Rule(RuleType.number())
  extractHelpDeliverForAgent: number;

  @Rule(RuleType.number())
  extractHelpGetForAgent: number;

  @Rule(RuleType.number())
  extractHelpBuyForAgent: number;

  @Rule(RuleType.number())
  citysValuationId?: number;

  @Rule(RuleType.number())
  citysWeightTagId?: number;

  @Rule(RuleType.number())
  citysTagGroupId?: number;

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class CityUpdateDTO extends CityAddDTO {
  @Rule(RuleType.string().length(16).required())
  cityNo: string;
}

export class CityListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  cityNo?: string;

  @Rule(RuleType.string().empty(''))
  cityName?: string;

  @Rule(RuleType.string().empty(''))
  province?: string;

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class CityStatusDTO extends PickDto(CityUpdateDTO, ['cityNo']) {
  @Rule(RuleType.number())
  status: 0 | 1;
}

export class CityValuationAddDTO {
  @Rule(RuleType.string().min(4).max(45).required())
  ruleName: string;

  @Rule(RuleType.object().required())
  ruleContext: ValuationRule;
}

export class CityValutionUpdateDTO extends CityValuationAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class CityValutionDelDTO extends PickDto(CityValutionUpdateDTO, [
  'id',
]) {}

export class CityValutionListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  ruleName?: string;

  @Rule(RuleType.string())
  id?: string;
}

export class CityWeightTagAddDTO {
  @Rule(RuleType.string().min(4).max(45).required())
  tagName: string;

  @Rule(RuleType.array().required())
  tags: WeightTag[];
}

export class CityWeightUpdateDTO extends CityWeightTagAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class CityWeightListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  tagName?: string;

  @Rule(RuleType.string())
  id?: string;
}

export class CityTagGroupAddDTO {
  @Rule(RuleType.string().min(1).max(45).required())
  groupName: string;

  @Rule(RuleType.array().required())
  tags: string[];
}
export class CityTagGroupUpdateDTO extends CityTagGroupAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class CityTagGroupListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  groupName?: string;

  @Rule(RuleType.string())
  id?: string;
}
