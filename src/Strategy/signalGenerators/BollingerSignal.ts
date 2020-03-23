import { IMarketData, IBollinger, IBollingerOptions, ICandles } from '@types';
import { logger } from '@shared';
import { bollingerBands } from '../indicators';

export class BollingerSignal {
  private options: IBollingerOptions;
  constructor(options: IBollingerOptions) {
    this.options = options;
  }

  public async advice({ quotePrice, candles }: IMarketData): Promise<number> {
    logger.debug('Quote Price', quotePrice);
    logger.debug(`Last close: ${candles.close[0]}`);
    logger.debug('CANDLES:', candles);
    
    const bollinger = bollingerBands(candles, this.options);
    logger.debug('BB:', bollinger);
    if (quotePrice.ask >= bollinger.upperBand[0]) {
      logger.debug('Shortea papu!');
      return -1;
    }

    if (quotePrice.bid <= bollinger.lowerBand[0]) {
      logger.debug('Entra en long');
      return 1;
    }

    return 0;
  }
}
