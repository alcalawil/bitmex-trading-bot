import * as talib from 'talib-binding';
import { ICandles, IBollinger, IBollingerOptions } from '@types';

export const bollingerBands = (candles: ICandles, { numberOfPeriods }: IBollingerOptions): IBollinger => {
  const [upperBand, middleBand, lowerBand] = talib.BBANDS(candles.close, numberOfPeriods, 2, 2);
  return {
    upperBand,
    lowerBand,
    middleBand,
  };
};

export const macd = (candles: ICandles) => {
  return talib.MACD(candles.close, 50, 2);
};
