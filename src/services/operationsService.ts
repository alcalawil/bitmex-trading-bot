import { gettersService } from './gettersService';
import {config} from '@config';

class OperationsService {
  public setDependencies() {
  }

  public async placeOrder() {
    const responseOrder = {};
    return responseOrder;
  }

  public async buy(price: number, amount: number, pair: string) {
    return this.placeOrder();
  }

  public async sell(){
    return this.placeOrder();
  }

  public async cancelOrder(orderId: string) {
    const parsedOrder = {};
    return parsedOrder;
  }

  public async cancelMyOrders(pair: string) {
    const canceledOrders= {}
    return canceledOrders;
  }
}

export const operationsService = new OperationsService();
