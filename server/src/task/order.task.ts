import { Inject, Queue } from '@midwayjs/decorator';
import { OrderService } from '../service/order.service';

// 自动关闭时间
export const ORDER_CLOSE_DELAY = 15 * 60 * 1000;
// 自动完成时间
export const ORDER_COMPLETE_DELAY = 2 * 60 * 60 * 1000;
// 自动取消时间
export const ORDER_CANCEL_DELAY = 2 * 60 * 60 * 1000;

/**
 * 待付款的订单自动关闭
 */

@Queue()
export class OrderWaitPayToCloseTask {
  @Inject()
  orderService: OrderService;

  async execute(params: { orderNo: string }) {
    await this.orderService.orderClose(params.orderNo);
  }
}

/**
 * 订单自动完成
 */
@Queue()
export class OrderAutoToCompleteTask {
  @Inject()
  orderService: OrderService;

  async execute(params: { orderNo: string }) {
    console.info(`[ task ] 订单${params.orderNo} 自动完成 开始...`);

    await this.orderService.orderComplete(params.orderNo, 'system');
  }
}

/**
 * 订单自动取消
 */
@Queue()
export class OrderAutoCancelTask {
  @Inject()
  orderService: OrderService;
  async execute(params: { orderNo: string }) {
    await this.orderService.orderCancel(
      { orderNo: params.orderNo, cancelReason: '2小时未接单,系统自动取消' },
      'system'
    );
  }
}
