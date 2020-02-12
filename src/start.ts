import { BitmexAPI, BitmexOptions } from './bitmexWrapper';

const options: BitmexOptions = {
  apiKeyID: process.env.BITMEX_KEY_ID,
  apiKeySecret: process.env.BITMEX_KEY_SECRET,
  testnet: true
};

const bitmex = new BitmexAPI(options);


(async () => {
  console.log('Hello world');
  const announcements = await bitmex.Announcement.get();
  console.log('Announcements:', announcements);
})();
