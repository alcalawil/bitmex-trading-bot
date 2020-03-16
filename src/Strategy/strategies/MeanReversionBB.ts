import StrategyBase from './StrategyBase';
import { IMarketData, IStrategyOrder, MarketSide } from '@types';
import { logger } from '@shared'
import { bollingerBands } from '@Strategy/indicators';

export class MeanReversionBB extends StrategyBase {
  constructor(id: string, expiration?: number) {
    expiration = 5000;
    super(id, expiration);
  }

  generateOrder(symbol: string, { candles, bestPrice }: IMarketData): IStrategyOrder | null {
    logger.debug('CANDLES: ', candles);
    const bollinger = bollingerBands(candles, 10);
    logger.debug('BOLLINGER:', bollinger);
    return null;
  }
}
