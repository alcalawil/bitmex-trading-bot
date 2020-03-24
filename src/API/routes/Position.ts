import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { HTTPError } from '@types';
import { Trader } from '@trader';
import { ETL } from '@etl';

export default (trader: Trader, etl: ETL) => {
  const router = Router();

  /****** ************************************************************************
   *                       Choose Leverage - "POST /api/position/leverage"
   ******************************************************************************/
  router.post('/leverage', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol, leverage }: { symbol: string; leverage: number } = req.body;
      const balances = await trader.updateLeverage({ symbol, leverage });
      res.status(CREATED).json(balances);
    } catch (err) {
      logger.error(err.message);
      next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
    }
  });

  /****** ************************************************************************
   *                       Get Position - "POST /api/position/"
   ******************************************************************************/
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pair }: { pair: string } = req.query;
      const position = await trader.getPosition(pair);
      res.status(CREATED).json(position);
    } catch (err) {
      logger.error(err.message);
      next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
    }
  });

  return router;
};
