import { config } from '@config';
import { BitmexAPI } from '../bitmex';
import { logger } from '../shared';
import { UserMarginQuery, OrderQuery } from '../bitmex/common/BitmexInterfaces';

let api: BitmexAPI;

class GettersService {
  public setDependencies(bitmexClient: BitmexAPI) {
    api = bitmexClient;
  }

  public async getMyOrders(orderQuery: OrderQuery) {
    // FIXME: There is a problem using filters
    const orders = await api.Order.getOrders(orderQuery);
    return orders;
  }

  public async getOrderById(orderId: string) {
    // TODO
    return {};
  }

  public async getOrderbook(pair: string, limit = 100) {
    // TODO
    return {};
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
      const balances = await api.User.getMargin({ currency: 'all' });
      if (balances.currency === 'XBt') {
        balances.amount = balances.amount * oneSatochiInBTC;
      }
      return balances;
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export const gettersService = new GettersService();
