declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: string;
    BITMEX_KEY_ID?: string;
    BITMEX_KEY_SECRET?: string;
    SERVER_PORT?: string;
    BITMEX_TESTNET?: string;
    API_KEY?: string;
  }
}
