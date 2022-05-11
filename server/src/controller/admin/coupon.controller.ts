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
import { Repository } from 'typeorm';
import {
  CouponAddDTO,
  CouponListDTO,
  CouponStatusDTO,
  CouponUpdateDTO,
} from '../../dto/coupon.dto';
import { CouponEntity } from '../../entity/coupon.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('/admin/coupon', { middleware: [AdminMiddleware] })
export class CouponController extends BaseController {
  @InjectEntityModel(CouponEntity)
  couponEntity: Repository<CouponEntity>;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: CouponAddDTO) {
    const result = await this.couponEntity.insert(
      Object.assign(dto, {
        couponNo: this.nanoid(16),
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加优惠券失败');
    }
    return this.responseSuccess('添加优惠券成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: CouponUpdateDTO) {
    const result = await this.couponEntity.update(
      {
        couponNo: dto.couponNo,
      },
      Object.assign(dto, {
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (result.affected === 0) {
      throw new DefaultError('修改优惠券失败');
    }
    return this.responseSuccess('修改优惠券成功');
  }

  @Put('/status')
  @Validate()
  async status(@Body() dto: CouponStatusDTO) {
    const result = await this.couponEntity.update(
      {
        couponNo: dto.couponNo,
      },
      {
        status: dto.status,
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('更改状态失败');
    }
    return this.responseSuccess('状态已更改');
  }

  @Get('/list')
  @Validate()
  async list(@Query() listDTO: CouponListDTO) {
    let wheres = '';
    if (listDTO.couponName)
      wheres += ` ${wheres ? ' and ' : ''} couponName like "%${
        listDTO.couponName
      }%"`;

    if (listDTO.couponNo)
      wheres += ` ${wheres ? ' and ' : ''} couponNo = ${listDTO.couponNo}`;

    const result = await this.queryService.select(this.couponEntity, {
      tables: 'coupons',
      wheres,
      current: listDTO.current,
      pageSize: listDTO.pageSize,
    });

    return this.responseSuccess('ok', result);
  }
}
