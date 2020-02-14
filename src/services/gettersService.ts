import { config } from '@config';
import { BitmexAPI } from '../bitmexWrapper';
import { logger } from '../shared';

let _bitmex: BitmexAPI;

class GettersService {
  public setDependencies(bitmexClient: BitmexAPI) {
    _bitmex = bitmexClient;
  }

  public async getOrders() {
    const orders: any = [];

    return orders;
  }

  public async getOrderById(orderId: string) {
    const responseOrder = {};

    return responseOrder;
  }

  public async getOrderbook(pair: string, limit = 100) {
    const sellOrders = {};
    const buyOrders = {};
    return {
      sellOrders,
      buyOrders,
    };
  }

  public async getAsk(pair: string) {
    const askPrice = 200;
    return askPrice;
  }

  public async getBid(pair: string) {
    const buyPrice = 100;
    return buyPrice;
  }

  public async getBalances() {
    try {
      const balances = await _bitmex.User.getMargin();
      return balances;
    } catch(err) {
      logger.error(err.message)
    }
  }
}

export const gettersService = new GettersService();
