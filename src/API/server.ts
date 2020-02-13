import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { authKey, errorHandler } from './middlewares';
import BaseRouter from './routes';
import { config } from '@config';

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

app
  .use('/api', BaseRouter)
  .use(errorHandler);

export default app;
