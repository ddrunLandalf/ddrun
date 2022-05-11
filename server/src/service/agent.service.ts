import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { AgentListDTO } from '../dto/agent.dto';
import { AgentEntity } from '../entity/agent.entity';
import { BaseService } from './base.service';
import { QueryService } from './query.service';

@Provide()
export class AgentService extends BaseService {
  @InjectEntityModel(AgentEntity)
  agentEntity: Repository<AgentEntity>;

  @Inject()
  queryService: QueryService;

  async list(listDTO: AgentListDTO) {
    let wheres = '';
    if (listDTO.agentAccount)
      wheres += ` ${wheres ? 'and' : ''} agentAccount like "%${
        listDTO.agentAccount
      }%"`;

    if (listDTO.agentNo) {
      wheres += ` ${wheres ? 'and' : ''} agentNo = "${listDTO.agentNo}"`;
    }

    if (listDTO.mobileNumber) {
      wheres += ` ${wheres ? 'and' : ''} mobileNumber = "${
        listDTO.mobileNumber
      }"`;
    }

    if (listDTO.realName) {
      wheres += ` ${wheres ? 'and' : ''} realName like "%${listDTO.realName}%"`;
    }

    if (listDTO.status !== undefined) {
      wheres += `  ${wheres ? 'and' : ''} status = ${listDTO.status}`;
    }

    return await this.queryService.select(this.agentEntity, {
      tables: 'agents',
      wheres,
      fields:
        'agentNo,agentAccount,mobileNumber,realName,status,createTime,updateTime,defaultPwd,updatedBy',
      current: listDTO.current,
      pageSize: listDTO.pageSize,
    });
  }
}
