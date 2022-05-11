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
  CityTagGroupAddDTO,
  CityTagGroupListDTO,
  CityTagGroupUpdateDTO,
  CityValutionDelDTO,
} from '../../dto/city.dto';
import { CitysTagGroupEntity } from '../../entity/citysTagGroup.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

/**
 * 重量标签
 */
@Controller('/admin/citys/tag', { middleware: [AdminMiddleware] })
export class CitysTagGroupController extends BaseController {
  @Inject()
  queryService: QueryService;

  @InjectEntityModel(CitysTagGroupEntity)
  citysTagEntity: Repository<CitysTagGroupEntity>;

  @Post('/add')
  @Validate()
  async add(@Body() addDTO: CityTagGroupAddDTO) {
    const result = await this.citysTagEntity.insert(
      Object.assign(addDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
        createdBy: 'admin',
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加标签组失败');
    }
    return this.responseSuccess('添加标签组成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() updateDTO: CityTagGroupUpdateDTO) {
    const result = await this.citysTagEntity.update(
      {
        id: updateDTO.id,
        createdBy: 'admin',
      },
      Object.assign(updateDTO, {
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (result.affected === 0) {
      throw new DefaultError('修改标签组失败');
    }
    return this.responseSuccess('修改标签组成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDTO: CityTagGroupListDTO) {
    let wheres = 'isDelete=0 and createdBy="admin" ';
    if (listDTO.groupName)
      wheres += ` and groupName like "%${listDTO.groupName}%"`;

    if (listDTO.id) wheres += ` and id = ${listDTO.id}`;

    const result = await this.queryService.select(this.citysTagEntity, {
      tables: 'citysTagGroup',
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
    const result = await this.citysTagEntity.update(
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
      throw new DefaultError('删除标签组失败');
    }
    return this.responseSuccess('标签组已删除');
  }
}
