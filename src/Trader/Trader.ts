import { config } from '@config';
import { BitmexAPI } from '@bitmex';
import { OrderPost, OrderDelete, PositionLeveragePost, OrderQuery } from '@bitmexInterfaces';

export class Trader {
  private api: BitmexAPI;
  constructor(api: BitmexAPI) {
    this.api = api;
  }

  public async postOrder(orderOptions: OrderPost) {
    // TODO: Recibir solo parámetro que la estrategia pueda enviar
    const responseOrder = await this.api.Order.new(orderOptions);
    return responseOrder;
  }

  public async postBulkOrders(orders: OrderPost[]) {
    const responseOrder = await this.api.Order.newBulk({ orders });
    return responseOrder;
  }

  public async cancelOrder(orderOptions: OrderDelete) {
    // TODO: Allow receiving multiple orderIds --> Fix OrderDelete interface
    const order = await this.api.Order.cancel(orderOptions);
    return order;
  }

  public async cancelAll() {
    // TODO: Receive optional params
    const orders = await this.api.Order.cancelAll();
    return orders;
  }

  public async updateLeverage(options: PositionLeveragePost) {
    return this.api.Position.updateLeverage(options);
  }

  // ------------------------------------------------

  public async getMyOrders(orderQuery: OrderQuery) {
    // FIXME: There is a problem using filters
    const orders = await this.api.Order.getOrders(orderQuery);
    return orders;
  }

  public async getOrderById(orderId: string, pair: string) {
    const order = await (await this.getMyOrders({ symbol: pair })).find(order => (order.clOrdID = orderId));
    return order;
  }

  public async getBalances() {
    const oneSatochiInBTC = 0.00000001;
    // const qs: UserMarginQuery
    const balances = await this.api.User.getMargin();
    balances.amount = balances.amount * oneSatochiInBTC;

    return balances;
  }
}
