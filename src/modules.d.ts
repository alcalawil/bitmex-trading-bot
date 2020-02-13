declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    DB_URL: string;
    DB_NAME?: string;
    NODE_ENV: string;
    BITMEX_KEY_ID: string;
    BITMEX_KEY_SECRET: string;
    SERVER_PORT: number;
    BITMEX_TESTNET: string;
  }
}
