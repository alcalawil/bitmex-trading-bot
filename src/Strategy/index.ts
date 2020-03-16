import { v4 as uuidv4 } from 'uuid';
import { operationsService as trader } from '@trader';
import { logger } from '../shared';
import { strategyFactory } from './strategies';
import { OrderPost, Order } from '@bitmexInterfaces';
import { ETL } from '@etl';

export default class StrategyModule {
  // TODO: Usar algún interval más robusto
  private interval: NodeJS.Timeout | null;
  private etl: ETL;

  constructor(etl: ETL) {
    // TODO: Inyectar una instancia de trader
    this.interval = null;
    this.etl = etl;
  }

  public start() {
    let cycleNumber = 1;
    logger.debug('Strategy starting...');
    this.interval = setInterval(() => {
      logger.debug('Trading Cycle:', cycleNumber++);
      this.strategyCycle(); // TODO: Validar que un ciclo aterior se haya ejecutado para poder llamar al siguiente. Igual esto a ser ejecutado desde eventos en vez d eun interval
    }, 15000);
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.debug('Strategy module stopped');
  }

  public async strategyCycle() {
    logger.debug('New Cycle');

    // TODO: Recibir estos parámetros desde el config
    const marketData = await this.etl.getMarketData('XBTUSD', '1m', 50);

    const activeStrategy = strategyFactory('MeanReversionBB');
    const strategyOrder = activeStrategy.generateOrder('XBTUSD', marketData);

    if (!strategyOrder) {
      logger.info('There are no orders to post');
      return;
    }
    const { symbol, amount, side, price, expiration } = strategyOrder;
    /** Acá hay que hacer:
     *  Validar reglas de negocio. Ej: Chequear que haya suficiente volumen disponible como lo requiere la orden segun reglas de negocio
     *  Completar con valores default los datos que no haya proporcionado la estrategia. Ej: stop loss
     *
     */

    // TODO: Hacer el parseo por fuera, debería hacerse en la etapa previa (la de validación)
    const order = await trader.postOrder({
      clOrdID: uuidv4(),
      symbol: symbol,
      orderQty: amount || 1,
      side: side === -1 ? 'Sell' : 'Buy',
      price: price,
    });

    logger.debug('>>> Order response:', order);

    cancelAfter(expiration, order.clOrdID);
  }
}

// -----------------------------------------------------------------

const cancelAfter = (timeInMilliseconds: number, orderId: string) => {
  return new Promise<Order>((resolve, reject) => {
    setTimeout(async () => {
      try {
        const canceledOrder = await trader.cancelOrder({ clOrdID: orderId });
        logger.debug('<<< An order was canceled:', canceledOrder);
        return resolve(canceledOrder);
      } catch (err) {
        return reject(err);
      }
    }, timeInMilliseconds);
  });
};
