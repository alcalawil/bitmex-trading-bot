import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { authKey, errorHandler } from './middlewares';
import baseRouter from './routes';
import { config } from '@config';
import { Trader } from '@trader';
import { ETL } from '@etl';

export default (trader: Trader, etl: ETL) => {
  const app = express();

  /* MIDDLEWARES */
  config.nodeEnv === 'development' ? app.use(morgan('dev')) : null;
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors())
    .use(cookieParser());

  // Auth
  if (config.serverApiKey) {
    app.use(authKey);
  }

  app.use('/api', baseRouter(trader, etl)).use(errorHandler);
  return app;
};
