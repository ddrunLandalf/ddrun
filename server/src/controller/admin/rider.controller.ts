import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  RiderListDTO,
  RiderPassDTO,
  RiderReceiveDTO,
  RiderRefuseDTO,
  RiderRegisterListDTO,
  SimulationRiderAddDTO,
} from '../../dto/rider.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { RiderService } from '../../service/rider.service';
import { WxSubscribeMessageService } from '../../service/wx/subscribeMessage.service';
import { BaseController } from '../base.controller';

@Controller('/admin/rider', { middleware: [AdminMiddleware] })
export class AdminRiderController extends BaseController {
  @Inject()
  riderService: RiderService;

  @Inject()
  queryService: QueryService;

  @Inject()
  subscribeSerivce: WxSubscribeMessageService;

  /**
   * 模拟添加骑手
   * @param dto
   * @returns
   */
  @Post('/add')
  @Validate()
  async add(@Body() dto: SimulationRiderAddDTO) {
    const find = await this.riderService.riderRegisterEntity.findOne({
      where: { userNo: dto.userNo },
    });
    if (!find) {
      const registerAdd = await this.riderService.riderRegisterEntity.insert(
        dto
      );
      if (!registerAdd.raw.insertId) {
        throw new DefaultError('添加失败');
      }
    } else {
      const registerUpdate = await this.riderService.riderRegisterEntity.update(
        {
          userNo: dto.userNo,
        },
        dto
      );
      if (registerUpdate.affected === 0) {
        throw new DefaultError('更新失败');
      }
    }

    if (dto.status === 1) {
      await this.riderService.addRider(dto.userNo);
    }

    return this.responseSuccess('操作成功');
  }

  /**
   * 通过审核
   * @param dto
   */
  @Put('/pass')
  @Validate()
  async pass(@Body() dto: RiderPassDTO) {
    const registerUpdate = await this.riderService.riderRegisterEntity.update(
      {
        userNo: dto.userNo,
      },
      {
        status: 1,
      }
    );
    if (registerUpdate.affected === 0) {
      throw new DefaultError('操作失败');
    }
    await this.riderService.addRider(dto.userNo);

    // 发送通知
    this.subscribeSerivce.riderVerifyChangeNoticeSend(
      dto.userNo,
      1,
      Date.now()
    );
    return this.responseSuccess('操作成功');
  }

  /**
   * 拒绝通过
   * @param dto
   */
  @Put('/refuse')
  @Validate()
  async refuse(@Body() dto: RiderRefuseDTO) {
    const update = await this.riderService.riderRegisterEntity.update(
      {
        userNo: dto.userNo,
      },
      {
        refuseReason: dto.refuseReason,
        status: 2,
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('操作失败');
    }
    const find = await this.riderService.riderEntity.findOne({
      where: { userNo: dto.userNo },
    });
    if (find) {
      await this.riderService.riderEntity.update(
        {
          userNo: dto.userNo,
        },
        {
          status: 0,
        }
      );
    }
    // 发送通知
    this.subscribeSerivce.riderVerifyChangeNoticeSend(
      dto.userNo,
      2,
      Date.now(),
      dto.refuseReason
    );
    return this.responseSuccess('操作成功');
  }

  @Get('/register/list')
  @Validate()
  async registerList(@Query() dto: RiderRegisterListDTO) {
    let wheres = '';
    if (dto.userNo) {
      wheres += `userNo = "${dto.userNo}"`;
    }
    if (dto.status) {
      wheres += ` ${wheres ? ' and ' : ''} status = ${dto.status}`;
    }
    const result = await this.queryService.select(
      this.riderService.riderRegisterEntity,
      {
        tables: 'riderRegister',
        wheres,
        current: dto.current,
        pageSize: dto.pageSize,
      }
    );
    return this.responseSuccess('ok', result);
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: RiderListDTO) {
    const tables = 'riders rs, riderRegister rr, users u';
    const fields = 'rs.*,rr.realname,u.mobileNumber,u.avatarUrl,u.nickName';
    let wheres = 'rr.userNo = u.userNo and rs.userNo = u.userNo';
    if (dto.idCardNo) {
      wheres += ` and rr.icCardNo="${dto.idCardNo}"`;
    }
    if (dto.mobileNumber) {
      wheres += ` and u.mobileNumber like "%${dto.mobileNumber}%"`;
    }
    if (dto.realname) {
      wheres += ` and rr.realname like "%${dto.realname}%"`;
    }
    if (dto.riderNo) {
      wheres += ` and rs.riderNo="${dto.riderNo}"`;
    }
    const result = await this.queryService.select(
      this.riderService.riderEntity,
      {
        tables,
        wheres,
        fields,
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'rs.createTime desc',
      }
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 更改接受订单状态
   */
  @Put('/receive/status')
  @Validate()
  async receiveStatus(@Body() dto: RiderReceiveDTO) {
    const result = await this.riderService.riderEntity.update(
      {
        riderNo: dto.riderNo,
      },
      {
        startReceive: dto.startReceive,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('设置失败');
    }
    return this.responseSuccess('设置成功');
  }
}
