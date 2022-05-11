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
import { BankAddDTO, BankDelDTO, BankUpdateDTO } from '../../dto/bank.dto';
import { SelectCommonDTO } from '../../dto/common.dto';
import { BanksEntity } from '../../entity/banks.entity';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

// 添加银行卡
@Controller('/api/bank', { middleware: [AppMiddleware] })
export class BankController extends BaseController {
  @InjectEntityModel(BanksEntity)
  banksEntity: Repository<BanksEntity>;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: BankAddDTO) {
    const res = await this.banksEntity.insert(
      Object.assign(dto, {
        userNo: this.ctx.userInfo.userNo,
        bankNo: this.nanoid(16),
      })
    );
    if (!res.raw.insertId) {
      throw new DefaultError('添加银行卡失败');
    }
    return this.responseSuccess('成功添加一张银行卡');
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: BankUpdateDTO) {
    const res = await this.banksEntity.update(
      {
        bankNo: dto.bankNo,
      },
      dto
    );
    if (res.affected === 0) {
      throw new DefaultError('更新银行卡失败');
    }
    return this.responseSuccess('更新银行卡成功');
  }

  @Del('/del')
  @Validate()
  async del(@Body() dto: BankDelDTO) {
    const res = await this.banksEntity.update(
      {
        bankNo: dto.bankNo,
      },
      {
        isDelete: true,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('删除银行卡失败');
    }
    return this.responseSuccess('删除银行卡成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const result = await this.queryService.select(this.banksEntity, {
      tables: 'banks',
      wheres: `isDelete=0 and userNo='${this.ctx.userInfo.userNo}'`,
      order: 'updateTime desc',
      current: dto.current,
      pageSize: dto.pageSize,
    });
    return this.responseSuccess('ok', result);
  }
}
