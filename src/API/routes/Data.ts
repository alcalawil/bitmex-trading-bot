import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { HTTPError } from '@types';
import { Trader } from '@trader';
import { ETL } from '@etl';

export default (trader: Trader, etl: ETL) => {
const router = Router();

/****** ************************************************************************
 *                       Get OHLC - "GET /api/data/ohlc"
 ******************************************************************************/
router.get('/ohlc', async (req: Request, res: Response, next: NextFunction) => {
  const { symbol, filter, count, start, binSize } = req.query;
  try {
    const balances = await etl.getCandles( symbol, binSize, count);
    res.status(CREATED).json(balances);
  } catch (err) {
    logger.error(err.message);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

return router;
};
