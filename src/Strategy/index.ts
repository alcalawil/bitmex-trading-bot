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
    if(this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.debug('Strategy module stopped');
  }

  public async strategyCycle() {
    logger.debug('Posting new Order');
  
    // TODO: Recibir MarketData
    const marketData = await this.etl.getMarketData('XBTUSD', '1m', 10);

    // TODO: Manejar caso en el que la estrategia no envíe nada (null)
    const { symbol, amount, side, price, expiration } = buyAndCancelStrategy.generateOrder('XBTUSD', {
      candles: marketData.candles,
      bestPrice: {
        ask: marketData.bestPrice.ask,
        bid: marketData.bestPrice.bid,
      },
    });
  
    /** Acá hay que hacer:
     *  Validar reglas de negocio. Ej: Chequear que haya suficiente volumen disponible como lo requiere la orden segun reglas de negocio
     *  Completar con valores default los datos que no haya proporcionado la estrategia. Ej: stop loss
     *  
     */
  
    // TODO: Generar id interno uuid
    // TODO: Hacer el parseo por fuera, debería hacerse en la etapa previa (la de validación)
    const order = await trader.postOrder({
      symbol: symbol,
      orderQty: amount || 1,
      side: side === -1 ? 'Sell' : 'Buy',
      price: price,
    });
  
    logger.debug('>>> Order response:', order);
  
    cancelAfter(expiration, order.orderID);
  }
}


const buyAndCancelStrategy = strategyFactory('BuyCheap');


// -----------------------------------------------------------------

const cancelAfter = (timeInMilliseconds: number, orderId: string) => {
  return new Promise<Order>((resolve, reject) => {
    setTimeout(async () => {
      try {
        const canceledOrder = await trader.cancelOrder({ orderID: orderId });
        logger.debug('<<< An order was canceled:', canceledOrder);
        return resolve(canceledOrder);
      } catch (err) {
        return reject(err);
      }
    }, timeInMilliseconds);
  });
};

