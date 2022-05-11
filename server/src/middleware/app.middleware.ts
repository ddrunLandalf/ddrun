import { IMiddleware, NextFunction } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context } from 'egg';
import { LoginError } from '../error/login.error';
import { WxappService } from '../service/wxapp.service';

@Middleware()
export class AppMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const wxappService = await ctx.requestContext.getAsync(WxappService);
      const wxappNo = ctx.request.header.wxappno as string;
      if (!wxappNo) {
        throw new LoginError('请重新登录');
      }

      const user = await wxappService.findByNo(wxappNo);
      if (!user) {
        throw new LoginError('请重新登录');
      }

      if (!user.userNo) {
        throw new LoginError('请先登录/注册');
      }

      ctx.userInfo = user;
      return await next();
    };
  }
}
