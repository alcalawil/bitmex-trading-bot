import { IStrategyOrder, MarketSide, IMarketData } from '@types';
import StrategyBase from './StrategyBase';
/**
 * Esta estrategia manda una orden de compra lejos del bid y pone un expire de 5 segundos para que
 * la orden sea cancelada 5 segundos luego de ser posteada
 */

// TODO: Hacer una clase padre para todas las estrategias
export class BuyCheap extends StrategyBase {
  constructor(expiration?: number) {
    expiration = 5000;
    super(expiration);
  }

  generateOrder(symbol: string, { candles, bestPrice }: IMarketData) {
    // TODO: use 2 decimals
    const price = Math.round((bestPrice.bid * 0.9)); // 10% below market price

    const order: IStrategyOrder = {
      price,
      symbol,
      side: MarketSide.long,
      expiration: this.expiration,
    };
    return order;
  }
}
