import { Body, Controller, Get, Inject, Post, Put } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import { RiderRegisterDTO, RiderUpdateDTO } from '../../dto/rider.dto';
import { RiderEntity } from '../../entity/rider.entity';
import { RiderRegisterEntity } from '../../entity/riderRegister.entity';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { CitysService } from '../../service/citys.service';
import { OrderService } from '../../service/order.service';
import { RiderService } from '../../service/rider.service';
import { BaseController } from '../base.controller';

@Controller('api/rider', { middleware: [AppMiddleware] })
export class RiderController extends BaseController {
  @InjectEntityModel(RiderRegisterEntity)
  riderRegisterEntity: Repository<RiderRegisterEntity>;

  @InjectEntityModel(RiderEntity)
  riderEntity: Repository<RiderEntity>;

  @Inject()
  cityService: CitysService;

  @Inject()
  orderService: OrderService;

  @Inject()
  riderService: RiderService;
  /**
   * 提交审核
   * @param dto
   * @returns
   */
  @Post('/register')
  @Validate()
  async register(@Body() dto: RiderRegisterDTO) {
    const riderRegister = await this.riderRegisterEntity.findOne({
      where: { userNo: this.ctx.userInfo.userNo },
    });
    if (riderRegister) {
      if (riderRegister.status === 1) {
        throw new DefaultError('您已通过审核，无需重复提交');
      }
      const result = await this.riderRegisterEntity.update(
        {
          userNo: this.ctx.userInfo.userNo,
        },
        { ...dto, status: 0 }
      );
      if (result.affected === 0) {
        throw new DefaultError('提交失败');
      }
    } else {
      const result = await this.riderRegisterEntity.insert(
        Object.assign(dto, { userNo: this.ctx.userInfo.userNo })
      );
      if (!result.raw.insertId) {
        throw new DefaultError('提交失败');
      }
    }
    return this.responseSuccess('ok');
  }

  /**
   * 查询审核信息
   */
  @Get('/register/info')
  async registerInfo() {
    const riderRegister = await this.riderRegisterEntity.findOne({
      where: { userNo: this.ctx.userInfo.userNo },
    });
    return this.responseSuccess('ok', riderRegister);
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: RiderUpdateDTO) {
    const update = await this.riderEntity.update(
      {
        userNo: this.ctx.userInfo.userNo,
      },
      dto
    );
    if (update.affected === 0) {
      throw new DefaultError('更新失败');
    }
    return this.responseSuccess('ok');
  }

  /**
   * 是否是骑手
   * @returns
   */
  @Get('/isRider')
  async isRider() {
    const rider = await this.riderEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });
    return this.responseSuccess('ok', !!rider);
  }

  @Get('/update/info')
  async updateInfo() {
    const rider = await this.riderService.forIsRider();
    let cityName = '';
    if (rider.cityNo) {
      const city = await this.cityService.findByNo(rider.cityNo);
      if (city) {
        cityName = city.cityName;
      }
    }
    return this.responseSuccess('ok', {
      startReceive: rider.startReceive,
      cityNo: rider.cityNo,
      cityName,
    });
  }
}
