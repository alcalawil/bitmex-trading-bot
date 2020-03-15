import { IMarketData, IStrategyOrder } from '@types';

export default abstract class StrategyBase {
  expiration: number;

  constructor(expiration: number) {
    this.expiration = expiration;
  }

  // TODO: A veces tiene que poder devolver null --> IStrategyOrder | null
  abstract generateOrder(symbol: string, { candles, bestPrice }: IMarketData): IStrategyOrder;
}
