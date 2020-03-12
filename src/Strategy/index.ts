import { operationsService as trader } from '@trader';
import { logger } from '../shared';
import { strategyFactory } from './strategies';
import { OrderPost, Order } from '@bitmexInterfaces';

/**
 * Spike 1
 * Colocar una Limit, esperar unos segundos y luego cancelarla, eso en forma cíclica indefinida.
 */

const buyAndCancelStrategy = strategyFactory('BuyCheap');

async function StrategyCycle() {
  logger.debug('Posting new Order');

  // TODO: Recibir MarketData
  // TODO: Manejar caso en el que la estrategia no envíe nada (null)
  const { symbol, amount, side, price, expiration } = buyAndCancelStrategy.generateOrder('XBTUSD', {
    candles: [],
    bestPrice: {
      ask: 7000,
      bid: 5000,
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

// TODO: Usar algún interval más robusto de npm
let interval: NodeJS.Timeout;

export const start = () => {
  let cycleNumber = 1;
  logger.debug('Strategy starting...');
  interval = setInterval(() => {
    logger.debug('Trading Cycle:', cycleNumber++);
    StrategyCycle(); // TODO: Validar que un ciclo aterior se haya ejecutado para poder llamar al siguiente. Igual esto a ser ejecutado desde eventos en vez d eun interval
  }, 15000);
};

export const stop = () => {
  clearInterval(interval);
  logger.debug('Strategy module stopped');
};
