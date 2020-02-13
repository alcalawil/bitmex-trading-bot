import { IConfig } from '@types';
const ENV = process.env;

const config: IConfig = {
  nodeEnv: ENV.NODE_ENV || 'development',
  logLevel: ENV.LOG_LEVEL || 'debug',
  bitmexKeyId: ENV.BITMEX_KEY_ID,
  bitmexSecretKey: ENV.BITMEX_KEY_SECRET,
  serverPort: Number(ENV.SERVER_PORT) || 3000, // Not sure
  useTestnet: ENV.BITMEX_TESTNET === 'true' ? true : false
};

export { config };
