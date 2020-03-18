import StrategyBase from './StrategyBase';
import { IMarketData, IStrategyOrder, MarketSide } from '@types';
import { logger } from '@shared';
import { BollingerSignal } from '../signalGenerators';

export class MeanReversionBB extends StrategyBase {
  private bollingerSignal: BollingerSignal;
  constructor(id: string, expiration = 5000) {
    super(id, expiration);
    this.bollingerSignal = new BollingerSignal();
  }

  async generateOrder(symbol: string, marketData: IMarketData): Promise<IStrategyOrder | null> {
    const bollingerAdvice = await this.bollingerSignal.advice(marketData, { numberOfPeriods: 10 });
    logger.debug(`BOLLINGER: ${bollingerAdvice}`);

    if (bollingerAdvice > 0.5) {
      // LONG
      logger.debug('>>> BUY LONG');
      const order: IStrategyOrder = {
        symbol,
        side: MarketSide.long,
        expiration: this.expiration,
      };
      return order;
    }

    if (bollingerAdvice < -0.5) {
      // Short
      logger.debug('>>> SELL SHORT');
      const order: IStrategyOrder = {
        symbol,
        side: MarketSide.short,
        expiration: this.expiration,
      };
      return order;
    }

    return null;
  }

  async monitorPosition() {
    // price
    // Volume
    // ROI
    // Target 
    // stop
    // expiration
    // -----------

    // return
    // 
  }
}
