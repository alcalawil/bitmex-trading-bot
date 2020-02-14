import { config } from '@config';
import { BitmexAPI } from '../bitmex';
import { logger } from '../shared';
import { UserMarginQuery } from '../bitmex/common/BitmexInterfaces';

let api: BitmexAPI;

class GettersService {
  public setDependencies(bitmexClient: BitmexAPI) {
    api = bitmexClient;
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
    const oneSatochiInBTC = 0.00000001;
    try {
      // const qs: UserMarginQuery
      const balances = await api.User.getMargin({ currency: 'all'});
      if (balances.currency === 'XBt') {
        balances.amount = balances.amount * oneSatochiInBTC;
      }
      return balances;
    } catch(err) {
      logger.error(err.message)
    }
  }
}

export const gettersService = new GettersService();
