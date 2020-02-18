import { config } from '@config';
import { BitmexAPI } from '@bitmex';
import { OrderPost, OrderDelete, OrderBulkPost } from '@bitmexInterfaces';

let api: BitmexAPI;

class OperationsService {
  public setDependencies(bitmexClient: BitmexAPI) {
    api = bitmexClient;
  }

  public async postOrder(orderOptions: OrderPost) {
    const responseOrder = await api.Order.new(orderOptions);
    return responseOrder;
  }

  public async postBulkOrders(orders: OrderPost[]) {
    const responseOrder = await api.Order.newBulk({ orders });
    return responseOrder;
  }

  public async cancelOrder(orderOptions: OrderDelete) {
    // TODO: Allow receiving multiple orderIds --> Fix OrderDelete interface
    const order = await api.Order.cancel(orderOptions);
    return order;
  }

  public async cancelAll() {
    // TODO: Receive optional params
    const orders = await api.Order.cancelAll();
    return orders;
  }
}

export const operationsService = new OperationsService();
