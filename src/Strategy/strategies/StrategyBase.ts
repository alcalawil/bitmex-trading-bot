import { IMarketData, IStrategyOrder } from '@types';

export default abstract class StrategyBase {
  expiration: number;
  id: string;
  constructor(id: string, expiration: number) {
    this.expiration = expiration;
    this.id = id;
  }

  // TODO: A veces tiene que poder devolver null --> IStrategyOrder | null
  abstract generateOrder(symbol: string, { candles, quotePrice }: IMarketData): Promise<IStrategyOrder | null>;
}
