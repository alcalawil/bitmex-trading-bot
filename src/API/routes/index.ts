import { Router, Request, Response } from 'express';
import ordersRouter from './Order';
import fundsRouter from './Funds';
import positionRouter from './Position';
import dataRouter from './Data';
import { Trader } from '@trader';
import { ETL } from '@etl';

export default (trader: Trader, etl: ETL) => {
  const router = Router();

  router.get('/status', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      serverTime: new Date(),
    });
  });

  // Add sub-routes
  router.use('/order', ordersRouter(trader, etl));
  router.use('/funds', fundsRouter(trader, etl));
  router.use('/position', positionRouter(trader, etl));
  router.use('/data', dataRouter(trader, etl));

  return router;
};
