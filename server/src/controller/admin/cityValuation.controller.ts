import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import {
  CityValuationAddDTO,
  CityValutionDelDTO,
  CityValutionListDTO,
  CityValutionUpdateDTO,
} from '../../dto/city.dto';
import { CitysValuationEntity } from '../../entity/citysValuation.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

/**
 * 计价规则
 */
@Controller('/admin/citys/valuation', { middleware: [AdminMiddleware] })
export class CityValuationController extends BaseController {
  @InjectEntityModel(CitysValuationEntity)
  citysValuationEntity: Repository<CitysValuationEntity>;

  @Inject()
  queryService: QueryService;

  /**
   * 添加计价规则
   * @param addDTO
   * @returns
   */
  @Post('/add')
  @Validate()
  async add(@Body() addDTO: CityValuationAddDTO) {
    const result = await this.citysValuationEntity.insert(
      Object.assign(addDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
        createdBy: 'admin',
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加计价规则失败');
    }
    return this.responseSuccess('添加计价规则成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() updateDTO: CityValutionUpdateDTO) {
    const result = await this.citysValuationEntity.update(
      {
        id: updateDTO.id,
        createdBy: 'admin',
      },
      Object.assign(updateDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (result.affected === 0) {
      throw new DefaultError('修改计价规则失败');
    }
    return this.responseSuccess('修改计价规则成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDTO: CityValutionListDTO) {
    let wheres = 'isDelete=0 and createdBy="admin" ';
    if (listDTO.ruleName)
      wheres += ` and ruleName like "%${listDTO.ruleName}%"`;

    if (listDTO.id) wheres += ` and id = ${listDTO.id}`;

    const result = await this.queryService.select(this.citysValuationEntity, {
      tables: 'citysValuation',
      wheres,
      current: listDTO.current,
      pageSize: listDTO.pageSize,
    });
    if (result.data) {
      for (const res of result.data) {
        res.ruleContext = JSON.parse(res.ruleContext);
      }
    }
    return this.responseSuccess('ok', result);
  }

  @Del('/del')
  @Validate()
  async del(@Body() delDTO: CityValutionDelDTO) {
    const result = await this.citysValuationEntity.update(
      {
        id: delDTO.id,
        createdBy: 'admin',
      },
      {
        isDelete: true,
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('删除计价规则失败');
    }
    return this.responseSuccess('计价规则已删除');
  }
}
