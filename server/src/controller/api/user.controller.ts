import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { UserUpdateDTO } from '../../dto/user.dto';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';

import { UserService } from '../../service/user.service';
import { BaseController } from '../base.controller';

@Controller('/api/user', { middleware: [AppMiddleware] })
export class UserController extends BaseController {
  @Inject()
  userService: UserService;

  @Post('/update')
  @Validate()
  async update(@Body() dto: UserUpdateDTO) {
    const result = await this.userService.userModel.update(
      {
        userNo: this.ctx.userInfo.userNo,
      },
      dto
    );
    if (result.affected === 0) {
      throw new DefaultError('更新用户信息失败');
    }
    return this.responseSuccess('ok');
  }

  @Get('/info')
  async info() {
    const user = await this.userService.findByNo(this.ctx.userInfo.userNo);
    return this.responseSuccess('ok', this.userService.getUserInfo(user));
  }
}
