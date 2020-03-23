import { BBANDS, MACD, MATypes } from 'talib-binding';
import { ICandles, IBollinger, IBollingerOptions } from '@types';

export const bollingerBands = (candles: ICandles, { numberOfPeriods }: IBollingerOptions): IBollinger => {
  const [upperBand, middleBand, lowerBand] = BBANDS(candles.close, numberOfPeriods, 2, 2, MATypes.EMA);
  return {
    upperBand,
    lowerBand,
    middleBand,
  };
};

export const macd = (candles: ICandles) => {
  return MACD(candles.close, 50, 2);
};
