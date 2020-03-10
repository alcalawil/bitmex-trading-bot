import { operationsService as trader } from '@trader';
import { logger } from '../shared';

/**
 * Spike 1
 * Colocar una Limit, esperar unos segundos y luego cancelarla, eso en forma cíclica indefinida.
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function postAndCancel() {
  logger.debug('Posting new Order');

  // TODO: Generar id interno uuid

  const order = await trader.postOrder({
    symbol: 'XBTUSD',
    orderQty: 1,
    side: 'Buy',
    price: 7000,
  });
  logger.debug('>>> Order:', order);

  await sleep(2000);

  //
  const canceledOrder = await trader.cancelOrder({ orderID: order.orderID });
  logger.debug('<<< Order canceled:', canceledOrder);
}

// TODO: Usar algún interval más robusto de npm
let interval: NodeJS.Timeout;

export const start = () => {
  logger.debug('Strategy starting...')
  interval = setInterval(() => {
    postAndCancel();
  }, 15000);
};

export const stop = () => {
  clearInterval(interval);
  logger.debug('Strategy module stopped')
};
