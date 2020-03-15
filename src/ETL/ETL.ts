import { ICandles, IBestPrice, IMarketData } from '@types';
import { BitmexSocket, BitmexAPI } from '../bitmex'; // TODO: Add absolute route to @bitmex in tsconfig
import { EventEmitter } from 'events';
import { Observable } from 'rxjs-compat';
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
        throw new Error(`ETL > getOHLC > Bitmex API: ${err.message}`);
      }
    };

    const ohlc = await getOHLC({ symbol: pair, count: quantity, binSize: period, reverse: true });
    const candles = this.tradeBinToCandles(ohlc);
    return candles;
  }

  async getBestPrice(pair: string): Promise<IBestPrice> {
    const existInCache = false;
    if (existInCache) {
      // TODO:
      // get from caché
    }

    try {
      const quotes = await this.apiClient.OrderBook.getL2({ symbol: pair, depth: 1 });
      const ask = quotes.find(quote => quote.side === 'Sell')?.price; // TODO: Ver si esto funciona en node 12
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
      // FIXME: Use a Promise.all
      const bestPrice = await this.getBestPrice(pair);
      const candles = await this.getCandles(pair, period, candlesQuantity);

      return {
        bestPrice,
        candles,
      };
    } catch (err) {
      throw new Error(`getMarket Error \n ${err.message}`);
    }
  }

  // async subscribeToCandles(pair: string, period: string, quantity: number): Observable<ICandles> {
  //   let action = (data: any) => console.log(data);

  //   switch (period) {
  //     case '1m':
  //       this.ws.tradeBin1m('XBTUSD').subscribe({
  //         next: ({ data }) => {
  //           this.emitter.emit('CANDLES_1M_UPDATE', {});
  //         },
  //       });

  //       break;

  //     case '5m':
  //     case '1h':
  //     case '1d':

  //     default:
  //       return this.emitter;
  //       break;
  //   }
  //   this.ws.tradeBin1m('XBTUSD');

  //   // 1. Get candles(quantity) from mongo (mongo should be updated)
  //   // return this.ws.tradeBin1m('XBTUSD');
  // }

  // async subscribeToBestPrice(pair: string) {}
}
