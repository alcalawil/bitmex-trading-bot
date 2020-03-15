import { BitmexAPI, BitmexOptions, BitmexSocket } from '@bitmex';
import { config } from '@config';
import app from './API/server';
import { logger } from '@shared';
import { gettersService, operationsService } from '@services';
import * as Strategy from '@Strategy';
import { ETL } from '@etl';

const options: BitmexOptions = {
  apiKeyID: config.bitmexKeyId,
  apiKeySecret: config.bitmexSecretKey,
  testnet: config.useTestnet,
};

// Init BitMEX Client
const bitmexClient = new BitmexAPI(options);
gettersService.setDependencies(bitmexClient);
operationsService.setDependencies(bitmexClient);

// Init BitMEX WebSocket
const bitmexWS = new BitmexSocket(options);

// Init ETL
const bitmexETL = new ETL(bitmexWS, bitmexClient);

// ETL Example
(async () => {
  const marketData = await bitmexETL.getMarketData('XBTUSD', '1m', 10);
  logger.debug('MarketData:', marketData);
})();

// Init API
app.listen(config.serverPort, () => {
  logger.info('Express server started on port: ' + config.serverPort);
});

// Init Strategy cycle
// Strategy.start();

/* ------------------------------------------------------------ */
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
