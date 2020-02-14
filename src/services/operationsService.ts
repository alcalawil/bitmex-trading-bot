import { config } from '@config';
import { BitmexAPI } from '@bitmex';

let api: BitmexAPI;

class OperationsService {
  public setDependencies(bitmexClient: BitmexAPI) {
    api = bitmexClient;
  }

  public async placeOrder() {
    const responseOrder = await api.Order.new({ symbol: 'XBTUSD', orderQty: 1 });
    return responseOrder;
  }

  public async buy(price: number, amount: number, pair: string) {
    return this.placeOrder();
  }

  public async sell() {
    return this.placeOrder();
  }

  public async cancelOrder(orderId: string) {
    const parsedOrder = {};
    return parsedOrder;
  }

  public async cancelMyOrders(pair: string) {
    const canceledOrders = {};
    return canceledOrders;
  }
}

export const operationsService = new OperationsService();
