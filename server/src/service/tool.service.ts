import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from './base.service';
import { createHash } from 'crypto';
import { JWTService } from './jwt.service';
const svgCaptcha = require('svg-captcha');

@Provide()
export class ToolService extends BaseService {
  @Inject()
  jwtService: JWTService;

  setMD5(pwd: string) {
    return createHash('md5').update(pwd).digest('hex');
  }

  async setCookie(data: any) {
    const token = this.jwtService.sign(data);
    this.ctx.cookies.set('token', token, {
      httpOnly: false,
    });
    return token;
  }

  /**
   * 获取svg验证码
   */
  getSvgCaptcha() {
    const captcha = svgCaptcha.create();
    return captcha as { data: string; text: string };
  }

  /**
   * 手机号加****
   * @param mobileNumber
   * @returns
   */
  getUnshowMobile(mobileNumber: string) {
    const mobile = mobileNumber;
    const split = mobile.split('');
    const str =
      split[0] +
      split[1] +
      split[2] +
      '****' +
      split[7] +
      split[8] +
      split[9] +
      split[10];
    return str;
  }

  randomRangeNumber(minNumber: number, maxNumber: number) {
    const range = maxNumber - minNumber; //取值范围的差

    const random = Math.random(); //小于1的随机数

    return (minNumber + Math.round(random * range)).toString(); //最小数与随机数和取值范围求和，返回想要的随机数字
  }
}
