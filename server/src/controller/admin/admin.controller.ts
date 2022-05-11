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
  AdminDTO,
  AdminInitDTO,
  AdminListDTO,
  AdminLoginDTO,
  AdminResetPwdDTO,
  AdminSetpwdDTO,
  AdminStatusDTO,
  AdminUpdateDTO,
} from '../../dto/admin.dto';
import { AdminEntity } from '../../entity/admin.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { AdminService } from '../../service/admin.service';
import { ToolService } from '../../service/tool.service';
import {
  InsertResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BaseController } from '../base.controller';

/**
 * 管理员
 */
@Controller('/admin')
export class AdminController extends BaseController {
  @InjectEntityModel(AdminEntity)
  adminEntity: Repository<AdminEntity>;

  @Inject()
  toolService: ToolService;

  @Inject()
  adminService: AdminService;

  /**
   * 管理员登录
   * @param adminLoginDTO
   * @returns
   */
  @Post('/login')
  @Validate()
  async login(@Body() adminLoginDTO: AdminLoginDTO) {
    // 获取验证码
    await this.adminService.verifySvgCode(
      adminLoginDTO.no,
      adminLoginDTO.verifyCode
    );
    const user = await this.adminEntity.findOne({
      adminName: adminLoginDTO.adminName,
    });
    if (!user) {
      throw new DefaultError('账号不存在');
    }
    const params = {} as any;
    if (user.adminPwd) {
      params.adminName = adminLoginDTO.adminName;
      params.adminPwd = this.toolService.setMD5(adminLoginDTO.adminPwd);
    } else {
      params.adminName = adminLoginDTO.adminName;
      params.defaultPwd = adminLoginDTO.adminPwd;
    }
    const result = await this.adminEntity.findOne(params);
    if (!result) {
      throw new DefaultError('账号或密码错误');
    }
    this.toolService.setCookie({
      adminNo: result.adminNo,
      ip: this.ctx.ip,
    });
    return this.responseSuccess('登录成功');
  }

  /**
   * 获取验证码
   * @returns
   */
  @Get('/verifycode')
  async getVerifycode() {
    const result = await this.adminService.getSvgCode();
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取管理员信息
   */
  @Get('/info', { middleware: [AdminMiddleware] })
  async info() {
    return this.responseSuccess('ok', this.adminService.getAdminInfo());
  }

  /**
   * 是否有超级管理员
   * @returns
   */
  @Get('/super')
  async hasSuper() {
    return this.responseSuccess('ok', await this.adminService.hasSuperAdmin());
  }

  /**
   * 添加超级管理员
   * @param adminInitDTO
   * @returns
   */
  @Post('/init')
  @Validate()
  async initAdmin(@Body() adminInitDTO: AdminInitDTO) {
    if (adminInitDTO.adminPwd !== adminInitDTO.confirmPwd) {
      throw new DefaultError('密码不正确');
    }
    const hasAdmin = await this.adminService.hasSuperAdmin();
    if (hasAdmin) {
      throw new DefaultError('超级管理已存在');
    }
    const result = await this.adminService.addSuperAdmin(adminInitDTO);
    return this.responseSuccess('ok', result.raw);
  }

  @Get('/list', { middleware: [AdminMiddleware] })
  @Validate()
  async adminList(@Query() adminListDto: AdminListDTO) {
    return this.responseSuccess(
      'ok',
      await this.adminService.list(adminListDto)
    );
  }

  @Put('/status', { middleware: [AdminMiddleware] })
  @Validate()
  async status(@Body() adminStatusDTO: AdminStatusDTO) {
    if (this.ctx.adminInfo.adminNo === adminStatusDTO.adminNo) {
      throw new DefaultError('无法修改自己的状态');
    }
    const result = await this.adminEntity.update(
      { adminNo: adminStatusDTO.adminNo },
      {
        status: adminStatusDTO.status,
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('修改状态失败');
    }
    return this.responseSuccess('修改状态成功');
  }

  @Post('/add', { middleware: [AdminMiddleware] })
  @Validate()
  async add(@Body() addDTO: AdminDTO) {
    await this.adminEntity
      .insert(
        Object.assign(addDTO, {
          adminNo: this.nanoid(16),
          defaultPwd: this.toolService.randomRangeNumber(10000, 999999),
          updatedBy: this.ctx.adminInfo.adminNo,
        })
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('账户名称重复');
        } else {
          throw new DefaultError('添加账户异常');
        }
      })
      .then(async (result: InsertResult) => {
        if (!result.raw.insertId) {
          throw new DefaultError('添加账户失败');
        }
      });
    return this.responseSuccess('添加管理员成功');
  }

  @Put('/update', { middleware: [AdminMiddleware] })
  @Validate()
  async update(@Body() updateDTO: AdminUpdateDTO) {
    await this.adminEntity
      .update(
        { adminNo: updateDTO.adminNo },
        {
          adminName: updateDTO.adminName,
          realName: updateDTO.realName,
          mobileNumber: updateDTO.mobileNumber,
          updatedBy: this.ctx.adminInfo.adminNo,
        }
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('账户名称重复');
        } else {
          throw new DefaultError('修改账户异常');
        }
      })
      .then(async (result: UpdateResult) => {
        if (result.affected === 0) {
          throw new DefaultError('修改账户失败');
        }
      });
    return this.responseSuccess('修改管理员信息成功');
  }

  /**
   * 设置密码
   * @param adminSetPwd
   * @returns
   */
  @Put('/setpwd', { middleware: [AdminMiddleware] })
  @Validate()
  async setpwd(@Body() adminSetPwd: AdminSetpwdDTO) {
    if (adminSetPwd.adminPwd !== adminSetPwd.confirmPwd) {
      throw new DefaultError('密码不一致');
    }
    const result = await this.adminEntity.update(
      {
        adminNo: this.ctx.adminInfo.adminNo,
      },
      {
        adminPwd: this.toolService.setMD5(adminSetPwd.adminPwd),
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('设置密码失败');
    }
    return this.responseSuccess('设置密码成功');
  }

  @Put('/resetpwd', { middleware: [AdminMiddleware] })
  @Validate()
  async resetpwd(@Body() resetDTO: AdminResetPwdDTO) {
    if (this.ctx.adminInfo.adminNo === resetDTO.adminNo) {
      throw new DefaultError('无法重置自己的密码');
    }
    const result = await this.adminEntity.update(
      {
        adminNo: resetDTO.adminNo,
      },
      {
        defaultPwd: this.toolService.randomRangeNumber(10000, 999999),
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('重置失败');
    }
    return this.responseSuccess('重置成功');
  }
}
