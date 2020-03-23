import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { config } from '@config';
import { HTTPError } from '@types';
import { ETL } from '@etl';
import { Trader } from '@trader';
export default (trader: Trader, etl: ETL) => {
  const router = Router();

  /****** ************************************************************************
   *                       Get Balances - "GET /api/funds/balances"
   ******************************************************************************/
  router.get('/balances', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balances = await trader.getBalances();
      res.status(CREATED).json(balances);
    } catch (err) {
      logger.error(err.message);
      next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
    }
  });

  return router;
};
