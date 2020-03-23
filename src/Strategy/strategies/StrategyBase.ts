import { IMarketData, IStrategyOrder } from '@types';
import { OrderPost, Order } from '@bitmexInterfaces';
import { Trader } from "@trader";
export default abstract class StrategyBase {
  expiration: number;
  id: string;
  constructor(id: string, expiration: number) {
    this.expiration = expiration;
    this.id = id;
  }

  abstract onStart(marketData: IMarketData): Promise<any>;
  abstract onFill(order: Order, marketData: IMarketData): Promise<any>;
}
