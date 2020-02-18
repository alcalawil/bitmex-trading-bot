import { config } from '@config';
import { BitmexAPI } from '@bitmex';
import { OrderPost, OrderDelete } from '@bitmexInterfaces';

let api: BitmexAPI;

class OperationsService {
  public setDependencies(bitmexClient: BitmexAPI) {
    api = bitmexClient;
  }

  public async postOrder(orderOptions: OrderPost) {
    const responseOrder = await api.Order.new(orderOptions);
    return responseOrder;
  }

  public async cancelOrder(orderOptions: OrderDelete) {
    const order = await api.Order.cancel(orderOptions);
    return order;
  }

  public async cancelMyOrders(pair: string) {
    const canceledOrders = {};
    return canceledOrders;
  }
}

export const operationsService = new OperationsService();
