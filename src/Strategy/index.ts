import { v4 as uuidv4 } from 'uuid';
import { Trader } from '@trader';
import { logger } from '../shared';
import { strategyFactory } from './strategies';
import { OrderPost, Order } from '@bitmexInterfaces';
import { ETL } from '@etl';

import { MeanReversionBB } from './strategies/MeanReversionBB';

export default class StrategyModule {
  // TODO: Usar algún interval más robusto
  private interval: NodeJS.Timeout | null;
  private etl: ETL;
  private trader: Trader;

  constructor(trader: Trader, etl: ETL) {
    this.interval = null;
    this.etl = etl;
    this.trader = trader;
  }

  public async start() {
    logger.debug('Strategy starting...');
    const activeStrategy = new MeanReversionBB('MeanReversionBB', this.trader);
    const marketData = await this.etl.getMarketData('XBTUSD', '1m', 50);


    /* ------------------------ Event Handlers -------------------------------- */

    // Candle 1m event
    this.etl.getCandlesObservable('XBTUSD', '1m').subscribe({
      next: ({ data: candles }) => {
        logger.debug('New 1m candle event');
      },
    });

    // Order change events
    this.etl.getOrdersObservable('XBTUSD').subscribe({
      next: ({ data: orders }) => {
        const orderFilled = orders.filter(order => order.ordStatus === 'Filled');

        orderFilled.map(async ({ clOrdID }) => {
          // TODO: Traer esta orden desde el state o desde mongo
          const order = await this.trader.getOrderById(clOrdID, 'XBTUSD');

          if (!order) {
            logger.debug(`Order ${clOrdID} does not exist`);
            return;
          }
          // TODO: Sacar esta marketData del state
          logger.debug(`ORDER FILLED: ${order.clOrdID} ${order.price} QTY: ${order.cumQty} SIDE: ${order.side}}`);

          activeStrategy.onFill(order, marketData);
        });
      },
    });

    activeStrategy.onStart(marketData);
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.debug('Strategy module stopped');
  }

  async cancelAfter(timeInMilliseconds: number, orderId: string) {
    return new Promise<Order>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const canceledOrder = await this.trader.cancelOrder({ clOrdID: orderId });
          logger.debug('<<< An order was canceled:', canceledOrder);
          return resolve(canceledOrder);
        } catch (err) {
          return reject(err);
        }
      }, timeInMilliseconds);
    });
  }
}
