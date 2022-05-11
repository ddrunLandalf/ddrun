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
  CityAddDTO,
  CityListDTO,
  CityStatusDTO,
  CityUpdateDTO,
} from '../../dto/city.dto';
import { CitysEntity } from '../../entity/citys.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { CitysService } from '../../service/citys.service';
import { BaseController } from '../base.controller';

@Controller('/admin/citys', { middleware: [AdminMiddleware] })
export class AdminCitysController extends BaseController {
  @InjectEntityModel(CitysEntity)
  citysEntity: Repository<CitysEntity>;

  @Inject()
  cityService: CitysService;

  @Post('/add')
  @Validate()
  async add(@Body() addDTO: CityAddDTO) {
    await this.citysEntity
      .insert(
        Object.assign(addDTO, {
          cityNo: this.nanoid(16),
          updatedBy: this.ctx.adminInfo.adminNo,
        })
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('城市名称重复');
        } else {
          throw new DefaultError('添加城市异常');
        }
      })
      .then(async (result: InsertResult) => {
        if (!result.raw.insertId) {
          throw new DefaultError('添加城市失败');
        }
      });
    return this.responseSuccess('添加城市成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() updateDTO: CityUpdateDTO) {
    await this.citysEntity
      .update(
        { cityNo: updateDTO.cityNo },
        Object.assign(updateDTO, {
          updatedBy: this.ctx.adminInfo.adminNo,
        })
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('城市名称重复');
        } else {
          console.log(err);
          throw new DefaultError('修改城市异常');
        }
      })
      .then(async (result: UpdateResult) => {
        if (result.affected === 0) {
          throw new DefaultError('修改城市失败');
        }
      });
    return this.responseSuccess('修改城市信息成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDto: CityListDTO) {
    return this.responseSuccess('ok', await this.cityService.list(listDto));
  }

  @Put('/status')
  @Validate()
  async status(@Body() statusDTO: CityStatusDTO) {
    const city = await this.cityService.findByNo(statusDTO.cityNo);
    if (!city) {
      throw new DefaultError('城市不存在');
    }

    if (!city.agentNo) {
      throw new DefaultError('城市暂无代理运营，无法修改状态');
    }

    const result = await this.citysEntity.update(
      { cityNo: statusDTO.cityNo },
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
}
