import { Inject, Controller } from '@midwayjs/decorator';
import { Context } from 'egg';
import { ResultResponse } from '../interface';
import { nanoid } from 'nanoid';

@Controller('/')
export class BaseController {
  @Inject()
  ctx: Context;

  nanoid(len = 13) {
    return nanoid(len);
  }

  /**
   * 响应成功
   * @param msg
   * @param data
   * @returns
   */
  responseSuccess(msg: string, data?: any): ResultResponse {
    return this.responseBody({ msg, data, code: 200 });
  }

  /**
   * 响应失败
   * @param msg
   * @param data
   * @returns
   */
  responseFail(msg: string, data?: any) {
    return this.responseBody({ msg, data, code: 1000 });
  }

  /**
   * 响应体
   * @param param0
   * @returns
   */
  responseBody({
    msg,
    data,
    code,
  }: {
    msg: string;
    data: any;
    code: number;
  }): ResultResponse {
    return {
      code,
      msg,
      data,
    };
  }
}
