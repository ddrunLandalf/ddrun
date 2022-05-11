import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  CONFIG_ALI,
  CONFIG_APPAUTH_INFO,
  CONFIG_COUPON,
  CONFIG_MAPKEY,
  CONFIG_APPMCH,
  CONFIG_NOTICE,
  CONFIG_ORDER_CANCEL,
  CONFIG_ORDER_FEE,
  CONFIG_GUIDE_USER,
  CONFIG_GUIDE_RIDER,
  CONFIG_CASH,
  CONFIG_SHARE,
  CONFIG_INTEGRAL,
  CONFIG_AGREEMENT_RIDER,
} from '../../constant';
import {
  AliDTO,
  AppauthUpsertDTO,
  AppMchDTO,
  ConfigCancelOrderDTO,
  ConfigCashDTO,
  ConfigGuideDTO,
  ConfigIntegralDTO,
  ConfigOrderFeeDTO,
  ConfigShareDTO,
  CouponSetDTO,
  MapKeyDTO,
  NoticeDTO,
} from '../../dto/config.dto';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { ConfigService } from '../../service/config.service';
import { BaseController } from '../base.controller';

@Controller('/admin/config', { middleware: [AdminMiddleware] })
export class ConfigController extends BaseController {
  @Inject()
  configService: ConfigService;

  @Post('/appauth')
  @Validate()
  async appUpsert(@Body() upDTO: AppauthUpsertDTO) {
    await this.configService.upsert(CONFIG_APPAUTH_INFO, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/appauth')
  async appGetInfo() {
    const result = await this.configService.getConfig(CONFIG_APPAUTH_INFO);
    return this.responseSuccess('ok', result);
  }

  @Post('/map')
  @Validate()
  async mapUpsert(@Body() upDTO: MapKeyDTO) {
    await this.configService.upsert(CONFIG_MAPKEY, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/map')
  async mapGetInfo() {
    const result = await this.configService.getConfig(CONFIG_MAPKEY);
    return this.responseSuccess('ok', result);
  }

  @Post('/ali')
  @Validate()
  async aliUpsert(@Body() upDTO: AliDTO) {
    await this.configService.upsert(CONFIG_ALI, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/ali')
  async aliInfoGet() {
    const result = await this.configService.getConfig(CONFIG_ALI);
    return this.responseSuccess('ok', result);
  }

  @Post('/coupon')
  @Validate()
  async couponUpsert(@Body() upDTO: CouponSetDTO) {
    await this.configService.upsert(CONFIG_COUPON, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/coupon')
  async couponGet() {
    const result = await this.configService.getConfig(CONFIG_COUPON);
    return this.responseSuccess('ok', result);
  }

  @Post('/appmch')
  @Validate()
  async mchUpsert(@Body() upDTO: AppMchDTO) {
    await this.configService.upsert(CONFIG_APPMCH, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/appmch')
  async mchGetInfo() {
    const result = await this.configService.getConfig(CONFIG_APPMCH);
    return this.responseSuccess('ok', result);
  }

  @Post('/notice')
  @Validate()
  async noticeSet(@Body() dto: NoticeDTO) {
    await this.configService.upsert(CONFIG_NOTICE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/notice')
  async noticeGet() {
    const result = await this.configService.getConfig(CONFIG_NOTICE);
    return this.responseSuccess('ok', result);
  }

  @Post('/ordercancel')
  @Validate()
  async orderCancel(@Body() dto: ConfigCancelOrderDTO) {
    await this.configService.upsert(CONFIG_ORDER_CANCEL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/ordercancel')
  async getOrderCancel() {
    const result = await this.configService.getConfig(CONFIG_ORDER_CANCEL);
    return this.responseSuccess('ok', result);
  }

  @Post('/orderfee')
  @Validate()
  async orderFee(@Body() dto: ConfigOrderFeeDTO) {
    await this.configService.upsert(CONFIG_ORDER_FEE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/orderfee')
  async getOrderFee() {
    const result = await this.configService.getConfig(CONFIG_ORDER_FEE);
    return this.responseSuccess('ok', result);
  }

  @Post('/guide/user')
  @Validate()
  async userGuidePost(@Body() dto: ConfigGuideDTO) {
    await this.configService.upsert(CONFIG_GUIDE_USER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/guide/user')
  async userGuideGet() {
    const result = await this.configService.getConfig(CONFIG_GUIDE_USER);
    return this.responseSuccess('ok', result);
  }

  @Post('/guide/rider')
  @Validate()
  async riderGuidePost(@Body() dto: ConfigGuideDTO) {
    await this.configService.upsert(CONFIG_GUIDE_RIDER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/guide/rider')
  async riderGuideGet() {
    const result = await this.configService.getConfig(CONFIG_GUIDE_RIDER);
    return this.responseSuccess('ok', result);
  }

  @Post('/agreement/rider')
  @Validate()
  async riderAgreementPost(@Body() dto: ConfigGuideDTO) {
    await this.configService.upsert(CONFIG_AGREEMENT_RIDER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/agreement/rider')
  async riderAgreementGet() {
    const result = await this.configService.getConfig(CONFIG_AGREEMENT_RIDER);
    return this.responseSuccess('ok', result);
  }

  @Post('/cash')
  @Validate()
  async cashPost(@Body() dto: ConfigCashDTO) {
    await this.configService.upsert(CONFIG_CASH, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/cash')
  async cashGet() {
    const result = await this.configService.getConfig(CONFIG_CASH);
    return this.responseSuccess('ok', result);
  }

  @Post('/share')
  @Validate()
  async sharePost(@Body() dto: ConfigShareDTO) {
    await this.configService.upsert(CONFIG_SHARE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/share')
  async shareGet() {
    const result = await this.configService.getConfig(CONFIG_SHARE);
    return this.responseSuccess('ok', result);
  }

  @Post('/integral')
  @Validate()
  async integralPost(@Body() dto: ConfigIntegralDTO) {
    await this.configService.upsert(CONFIG_INTEGRAL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/integral')
  async integralGet() {
    const result = await this.configService.getConfig(CONFIG_INTEGRAL);
    return this.responseSuccess('ok', result);
  }
}
