import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/decorator';
import { CashFailDTO, CashListDTO, CashSuccessDTO } from '../../dto/cash.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { CashService } from '../../service/cash.service';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('/admin/cash', { middleware: [AdminMiddleware] })
export class CashController extends BaseController {
  @Inject()
  queryService: QueryService;

  @Inject()
  cashService: CashService;

  @Get('/list')
  async list(@Query() dto: CashListDTO) {
    let where = ' ca.bankNo = ba.bankNo ';
    if (dto.cashBy) {
      where += ` and ca.cashBy='${dto.cashBy}' `;
    }
    if (dto.cashNo) {
      where += ` and ca.cashNo='${dto.cashNo}' `;
    }
    if (dto.status) {
      where += ` and ca.status=${dto.status} `;
    }
    if (dto.bankName) {
      where += ` and ba.bankName='%${dto.bankName}%' `;
    }
    if (dto.cardNo) {
      where += ` and ba.cardNo='%${dto.cardNo}%' `;
    }
    if (dto.realname) {
      where += ` and ba.realname='%${dto.realname}%' `;
    }
    const res = await this.queryService.select(this.cashService.cashEntity, {
      tables: 'cash ca, banks ba',
      wheres: where,
      order: 'ca.createTime desc',
      current: dto.current,
      pageSize: dto.current,
    });
    return this.responseSuccess('ok', res);
  }

  @Put('/success')
  async success(@Body() dto: CashSuccessDTO) {
    const res = await this.cashService.cashEntity.update(
      {
        cashNo: dto.cashNo,
      },
      {
        status: 1,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Put('/fail')
  async fail(@Body() dto: CashFailDTO) {
    const res = await this.cashService.cashEntity.update(
      {
        cashNo: dto.cashNo,
      },
      {
        reason: dto.reason,
        status: -1,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }
}
