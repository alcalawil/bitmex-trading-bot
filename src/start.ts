import { BitmexAPI, BitmexOptions, BitmexSocket } from '@bitmex';
import { config } from '@config';
import api from './API/server';
import { logger } from '@shared';
import { ETL } from '@etl';
import StrategyModule from '@Strategy';
import { Trader } from '@trader'

const options: BitmexOptions = {
  apiKeyID: config.bitmexKeyId,
  apiKeySecret: config.bitmexSecretKey,
  testnet: config.useTestnet,
};

// Bitmex API and WS clients
const bitmexClient = new BitmexAPI(options);
const bitmexWS = new BitmexSocket(options);

// Init trader
const trader = new Trader(bitmexClient);

// Init ETL
const bitmexETL = new ETL(bitmexWS, bitmexClient);

// Init Strategy cycle
const strategyModule = new StrategyModule(trader, bitmexETL);
strategyModule.start();

// Init API
api(trader, bitmexETL).listen(config.serverPort, () => {
  logger.info('Express server started on port: ' + config.serverPort);
});


/* ------------------------------------------------------------ */
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
