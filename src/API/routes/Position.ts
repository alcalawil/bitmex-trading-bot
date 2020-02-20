import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { HTTPError } from '@types';
import { operationsService, gettersService } from '@services';

const router = Router();

/****** ************************************************************************
 *                       Choose Leverage - "POST /api/position/leverage"
 ******************************************************************************/
router.post('/leverage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, leverage }: { symbol: string; leverage: number } = req.body;
    const balances = await operationsService.updateLeverage({ symbol, leverage });
    res.status(CREATED).json(balances);
  } catch (err) {
    logger.error(err.message);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

export default router;
