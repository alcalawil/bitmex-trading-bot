export interface IConfig {
  nodeEnv: string;
  logLevel: string;
  bitmexKeyId: string;
  bitmexSecretKey: string;
  serverPort: number;
  useTestnet: boolean;
  serverApiKey?: string;
}
