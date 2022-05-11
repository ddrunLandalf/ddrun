import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import {
  InsertResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import {
  AgentAddDTO,
  AgentListDTO,
  AgentResetPwdDTO,
  AgentStatusDTO,
  AgentUpdateDTO,
} from '../../dto/agent.dto';
import { AgentEntity } from '../../entity/agent.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { AgentService } from '../../service/agent.service';
import { ToolService } from '../../service/tool.service';
import { BaseController } from '../base.controller';

@Controller('/admin/agent', { middleware: [AdminMiddleware] })
export class AdminAgentController extends BaseController {
  @InjectEntityModel(AgentEntity)
  agentEntity: Repository<AgentEntity>;

  @Inject()
  toolService: ToolService;

  @Inject()
  agentService: AgentService;

  @Post('/add')
  @Validate()
  async add(@Body() agentAddDTO: AgentAddDTO) {
    await this.agentEntity
      .insert({
        agentNo: this.nanoid(16),
        agentAccount: agentAddDTO.agentAccount,
        defaultPwd: this.toolService.randomRangeNumber(10000, 999999),
        mobileNumber: agentAddDTO.mobileNumber,
        realName: agentAddDTO.realName,
        status: agentAddDTO.status,
        updatedBy: this.ctx.adminInfo.adminNo,
      })
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('账户名称重复');
        } else {
          throw new DefaultError('添加账户异常');
        }
      })
      .then(async (result: InsertResult) => {
        if (!result.raw.insertId) {
          throw new DefaultError('添加代理失败');
        }
      });
    return this.responseSuccess('添加代理成功');
  }

  @Post('/update')
  @Validate()
  async update(@Body() updateDTO: AgentUpdateDTO) {
    await this.agentEntity
      .update(
        { agentNo: updateDTO.agentNo },
        {
          agentAccount: updateDTO.agentAccount,
          realName: updateDTO.realName,
          mobileNumber: updateDTO.mobileNumber,
          status: updateDTO.status,
          updatedBy: this.ctx.adminInfo.adminNo,
        }
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('账户名称重复');
        } else {
          throw new DefaultError('修改账户异常');
        }
      })
      .then(async (result: UpdateResult) => {
        if (result.affected === 0) {
          throw new DefaultError('修改账户失败');
        }
      });
    return this.responseSuccess('修改代理信息成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDto: AgentListDTO) {
    return this.responseSuccess('ok', await this.agentService.list(listDto));
  }

  @Put('/status')
  @Validate()
  async status(@Body() statusDTO: AgentStatusDTO) {
    const result = await this.agentEntity.update(
      { agentNo: statusDTO.agentNo },
      {
        status: statusDTO.status,
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('修改状态失败');
    }
    return this.responseSuccess('修改状态成功');
  }

  @Put('/resetpwd')
  @Validate()
  async resetpwd(@Body() resetDTO: AgentResetPwdDTO) {
    const result = await this.agentEntity.update(
      {
        agentNo: resetDTO.agentNo,
      },
      {
        defaultPwd: this.toolService.randomRangeNumber(10000, 999999),
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('重置失败');
    }
    return this.responseSuccess('重置成功');
  }
}
