import { BitmexAPI, BitmexOptions } from './bitmexWrapper';
import { config } from '@config';
import app from './API/server';
import { logger } from '@shared';
import { gettersService } from '@services';

app.listen(config.serverPort, () => {
  logger.info('Express server started on port: ' + config.serverPort);
});

const options: BitmexOptions = {
  apiKeyID: config.bitmexKeyId,
  apiKeySecret: config.bitmexSecretKey,
  testnet: config.useTestnet,
};

const bitmexClient = new BitmexAPI(options);

gettersService.setDependencies(bitmexClient);

(async () => {
  console.log('Hello world');
  const announcements = await bitmexClient.Announcement.get();
  console.log('Announcements:', announcements[0].title);
})();

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
