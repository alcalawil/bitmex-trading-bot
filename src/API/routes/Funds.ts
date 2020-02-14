import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { config } from '@config';
import { HTTPError } from '@types';
import { operationsService, gettersService } from '@services';

const router = Router();

/****** ************************************************************************
 *                       Place Order - "POST /api/orders/place"
 ******************************************************************************/
router.get('/balances', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balances = await gettersService.getBalances();
    res.status(CREATED).json(balances);
  } catch (err) {
    logger.error(err);
    next(new HTTPError(err, INTERNAL_SERVER_ERROR));
  }
});

export default router;