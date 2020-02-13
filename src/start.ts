import { BitmexAPI, BitmexOptions } from './bitmexWrapper';
import { config } from '@config';

const options: BitmexOptions = {
  apiKeyID: config.bitmexKeyId,
  apiKeySecret: config.bitmexSecretKey,
  testnet: config.useTestnet
};

const bitmex = new BitmexAPI(options);

(async () => {
  console.log('Hello world');
  const announcements = await bitmex.Announcement.get();
  console.log('Announcements:', announcements[0].title);
})();
