import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { logger } from '@shared';
import { config } from '@config';
import { HTTPError } from '@types';
import { operationsService } from '@services';

// import { operationsService, gettersService } from '@services';

const router = Router();

/****** ************************************************************************
 *                       Place Order - "POST /api/orders/place"
 ******************************************************************************/
router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await operationsService.placeOrder();
    res.status(CREATED).json({
      message: 'Order successfully created',
      order
    });
  } catch (err) {
    logger.error(err);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

export default router;