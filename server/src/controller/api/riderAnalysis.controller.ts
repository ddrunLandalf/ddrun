import { Controller, Get, Inject } from '@midwayjs/decorator';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { RiderService } from '../../service/rider.service';
import { BaseController } from '../base.controller';

@Controller('/api/rider/analysis', { middleware: [AppMiddleware] })
export class RiderAnalysisController extends BaseController {
  @Inject()
  riderService: RiderService;

  @Get('/')
  async getData() {
    const rider = await this.riderService.riderEntity.findOne({
      where: { userNo: this.ctx.userInfo.userNo },
    });
    if (!rider) {
      throw new DefaultError('骑手不存在');
    }
    const data = await this.riderService.getCapital(rider.riderNo);

    const date = new Date();
    const dateValue = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    // 今日成单
    const today = await this.riderService.cashEntity.query(
      `select count(*) as total from orders where date_format(successTime,'%Y%c%e') = '${dateValue}' and status=4`
    );
    // 本月成单
    const month = await this.riderService.cashEntity.query(
      `select count(*) as total from orders where date_format(successTime,'%Y%c%e') <= '${dateValue}' and date_format(successTime,'%Y%c%e') >= '${date.getFullYear()}${
        date.getMonth() + 1
      }1' and status=4`
    );
    // 累计成单
    const all = await this.riderService.cashEntity.query(
      'select count(*) as total from orders where status=4'
    );
    const todayTotal = today[0].total;
    const monthTotal = month[0].total;
    const allTotal = all[0].total;
    return this.responseSuccess(
      'ok',
      Object.assign(data, { todayTotal, monthTotal, allTotal })
    );
  }
}
