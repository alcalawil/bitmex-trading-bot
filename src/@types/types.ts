import { OrderPost } from '@bitmexInterfaces';
import { type } from 'os';

export interface ICandles {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume?: number[];
}

// Best market prices
export interface IBestPrice {
  ask: number;
  bid: number;
}
export interface IMarketData {
  candles: ICandles;
  bestPrice: IBestPrice;
}

export const MarketSide = {
  long: 1,
  short: -1,
};

export interface IStrategyOrder {
  symbol: string;
  side: number; // 1 BUY -1 SELL
  price?: number;
  amount?: number;
  stop?: number;
  target?: number;
  expiration: number;
}
