import { IMarketData, IBollinger, IBollingerOptions } from '@types';
import { logger } from '@shared';
import { bollingerBands } from '../indicators';

export class BollingerSignal {
  public async advice({ quotePrice, candles }: IMarketData, bollingerOptions: IBollingerOptions): Promise<number> {
    logger.debug('Quote Price', quotePrice);
    logger.debug(`Last close: ${candles.close[0]}`);
    const bollinger = bollingerBands(candles, bollingerOptions);
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
