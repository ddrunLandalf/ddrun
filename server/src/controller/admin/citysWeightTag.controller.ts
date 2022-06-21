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
  CityValutionDelDTO,
  CityWeightListDTO,
  CityWeightTagAddDTO,
  CityWeightUpdateDTO,
} from '../../dto/city.dto';
import { CitysWeightTagEntity } from '../../entity/citysWeightTag.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

/**
 * 重量标签
 */
@Controller('/admin/citys/weight', { middleware: [AdminMiddleware] })
export class CitysWeightTagController extends BaseController {
  @Inject()
  queryService: QueryService;

  @InjectEntityModel(CitysWeightTagEntity)
  citysWeightTagEntity: Repository<CitysWeightTagEntity>;

  @Post('/add')
  @Validate()
  async add(@Body() addDTO: CityWeightTagAddDTO) {
    const result = await this.citysWeightTagEntity.insert(
      Object.assign(addDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
        createdBy: 'admin',
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加重量标签失败');
    }
    return this.responseSuccess('添加重量标签成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() updateDTO: CityWeightUpdateDTO) {
    const result = await this.citysWeightTagEntity.update(
      {
        id: updateDTO.id,
        createdBy: 'admin',
      },
      Object.assign(updateDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (result.affected === 0) {
      throw new DefaultError('修改重量标签失败');
    }
    return this.responseSuccess('修改重量标签成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDTO: CityWeightListDTO) {
    let wheres = 'isDelete=0 and createdBy="admin" ';
    if (listDTO.tagName) wheres += ` and tagName like "%${listDTO.tagName}%"`;

    if (listDTO.id) wheres += ` and id = ${listDTO.id}`;

    const result = await this.queryService.select(this.citysWeightTagEntity, {
      tables: 'citys_weight_tag',
      wheres,
      current: listDTO.current,
      pageSize: listDTO.pageSize,
    });
    if (result.data) {
      for (const res of result.data) {
        res.tags = JSON.parse(res.tags);
      }
    }
    return this.responseSuccess('ok', result);
  }

  @Del('/del')
  @Validate()
  async del(@Body() delDTO: CityValutionDelDTO) {
    const result = await this.citysWeightTagEntity.update(
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
      throw new DefaultError('删除重量标签失败');
    }
    return this.responseSuccess('重量标签已删除');
  }
}
