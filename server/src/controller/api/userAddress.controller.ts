import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import { SelectCommonDTO } from '../../dto/common.dto';
import { UserAddressAddDTO } from '../../dto/user.dto';
import { UserAddressEntity } from '../../entity/userAddress.entity';
import { AppMiddleware } from '../../middleware/app.middleware';
import { QueryService } from '../../service/query.service';
import { UserService } from '../../service/user.service';
import { UserAddressService } from '../../service/userAddress.service';
import { BaseController } from '../base.controller';

@Controller('/api/user/address', { middleware: [AppMiddleware] })
export class UserAddressController extends BaseController {
  @InjectEntityModel(UserAddressEntity)
  userAddressEntity: Repository<UserAddressEntity>;

  @Inject()
  userAddressService: UserAddressService;

  @Inject()
  userService: UserService;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async add(@Body() addDTO: UserAddressAddDTO) {
    const result = await this.userAddressService.add(addDTO);
    if (addDTO.type) {
      const key = addDTO.type === 'home' ? 'homeAddressNo' : 'companyAddressNo';
      await this.userService.userModel.update(
        {
          userNo: this.ctx.userInfo.userNo,
        },
        {
          [key]: result,
        }
      );
    }
    return this.responseSuccess('地址已更新');
  }

  /**
   * 获取公司及家的地址
   * @returns
   */
  @Get('/homeco')
  async getHomeAndCompanyAddress() {
    const user = await this.userService.findByNo(this.ctx.userInfo.userNo);
    const home = await await this.userAddressEntity.findOne({
      where: { addressNo: user.homeAddressNo, userNo: user.userNo },
    });
    const company = await this.userAddressEntity.findOne({
      where: {
        addressNo: user.companyAddressNo,
        userNo: user.userNo,
      },
    });
    return this.responseSuccess('ok', { home, company });
  }

  /**
   * 获取最近地址列表
   * @param dto
   */
  @Get('/list')
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const user = await this.userService.findByNo(this.ctx.userInfo.userNo);
    const result = await this.queryService.select(this.userAddressEntity, {
      tables: 'usersAddress',
      wheres: `isDelete=0 and userNo="${this.ctx.userInfo.userNo}" and addressNo != "${user.companyAddressNo}" and addressNo != "${user.homeAddressNo}"`,
      order: 'updateTime desc',
      current: dto.current,
      pageSize: dto.pageSize,
    });
    return this.responseSuccess('ok', result);
  }
}
