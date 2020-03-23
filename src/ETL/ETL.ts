import { ICandles, IQuotePrice, IMarketData } from '@types';
import { BitmexSocket, BitmexAPI } from '@bitmex';
import { EventEmitter } from 'events';
import { TradeBin, TradeBucketedQuery } from '@bitmexInterfaces';

export class ETL {
  private ws: BitmexSocket;
  private apiClient: BitmexAPI;
  private emitter: EventEmitter;
  constructor(ws: BitmexSocket, apiClient: BitmexAPI) {
    this.ws = ws;
    this.apiClient = apiClient;
    this.emitter = new EventEmitter();
  }

  initialize() {}

  // For developing purpose
  public get websocket(): BitmexSocket {
    return this.ws;
  }

  private tradeBinToCandles(ohlc: TradeBin[]): ICandles {
    const close: number[] = [];
    const open: number[] = [];
    const high: number[] = [];
    const low: number[] = [];

    ohlc.map(tradeBin => {
      close.push(tradeBin.close);
      open.push(tradeBin.open);
      high.push(tradeBin.high);
      low.push(tradeBin.low);
    });

    return {
      open,
      close,
      high,
      low,
    };
  }

  async getCandles(pair: string, period: string, quantity: number): Promise<ICandles> {
    const existInCache = false;
    if (existInCache) {
      // TODO:
      // get from caché
      // MongoDB
    }

    // Bitmex API
    const getOHLC = async (options: TradeBucketedQuery) => {
      try {
        const candles = await this.apiClient.Trade.getBucketed(options);
        return candles;
      } catch (err) {
        throw new Error(`ETL > getOHLC > Bitmex API: ${JSON.stringify(err)}`);
      }
    };

    const ohlc = await getOHLC({ symbol: pair, count: quantity, binSize: period, reverse: true });
    const candles = this.tradeBinToCandles(ohlc);
    return candles;
  }

  async getQuotePrice(pair: string): Promise<IQuotePrice> {
    const existInCache = false;
    if (existInCache) {
      // TODO:
      // get from caché
    }

    try {
      const quotes = await this.apiClient.OrderBook.getL2({ symbol: pair, depth: 1 });
      const ask = quotes.find(quote => quote.side === 'Sell')?.price;
      const bid = quotes.find(quote => quote.side === 'Buy')?.price;

      if (!ask || !bid) {
        throw new Error(`ETL > getOHLC > OrderBook format error`);
      }
      return {
        ask,
        bid,
      };
    } catch (err) {
      throw new Error(`ETL > getCandles > apiClient : \n ${err.message}`);
    }
  }

  async getMarketData(pair: string, period: string, candlesQuantity: number): Promise<IMarketData> {
    try {
      const [quotePrice, candles] = await Promise.all([
        this.getQuotePrice(pair),
        this.getCandles(pair, period, candlesQuantity),
      ]);

      return {
        pair,
        quotePrice,
        candles,
      };
    } catch (err) {
      throw new Error(`getMarket Error \n ${err.message}`);
    }
  }

  getCandlesObservable(pair: string, period = '1m') {
    switch (period) {
      case '1m':
        return this.ws.tradeBin1m(pair);
      case '5m':
        return this.ws.tradeBin5m(pair);
      case '1h':
        return this.ws.tradeBin1h(pair);
      case '1d':
        return this.ws.tradeBin1d(pair);

      default:
        return this.ws.tradeBin1m(pair);
    }
  }

  getPositionObservable(pair: string) {
    return this.ws.position(pair);
  }

  getOrdersObservable(pair: string) {
    return this.ws.order(pair);
  }
}
