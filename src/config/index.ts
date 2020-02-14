import { IConfig } from '@types';
import { logger } from '../shared';
const ENV = process.env;

// Validate required configs here
if (!ENV.BITMEX_KEY_ID || !ENV.BITMEX_KEY_SECRET) {
  process.exitCode = 1;
  throw new Error('INVALID BITMEX CREDENTIALS');
}

if (!ENV.API_KEY) {
  console.warn('Warning! No API KEY Set');
}

const config: IConfig = {
  nodeEnv: ENV.NODE_ENV || 'development',
  logLevel: ENV.LOG_LEVEL || 'debug',
  bitmexKeyId: ENV.BITMEX_KEY_ID,
  bitmexSecretKey: ENV.BITMEX_KEY_SECRET,
  serverPort: Number(ENV.SERVER_PORT) || 3000, // Not sure
  useTestnet: ENV.BITMEX_TESTNET === 'true' ? true : false,
  serverApiKey: ENV.API_KEY
};

export { config };
