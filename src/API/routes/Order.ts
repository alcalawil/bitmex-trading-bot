import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, OK, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
import { logger } from '@shared';
import { config } from '@config';
import { HTTPError } from '@types';
import { operationsService, gettersService } from '@services';
import { OrderPost } from '@bitmexInterfaces';

const router = Router();

/*******************************************************************************
 *                       Post Order - "POST /api/order"
 ******************************************************************************/
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const filter: string = req.query.filter || undefined;

  try {
    const orders = await gettersService.getMyOrders({ filter });
    res.status(CREATED).json(orders);
  } catch (err) {
    logger.error(err.message);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

/*******************************************************************************
 *                       Post Order - "POST /api/order"
 ******************************************************************************/
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderOptions: OrderPost = req.body;
    const order = await operationsService.postOrder(orderOptions);
    res.status(CREATED).json({
      message: 'Order successfully created',
      order,
    });
  } catch (err) {
    logger.error(err.message);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

/*******************************************************************************
 *                       Post Bulk Orders - "POST /api/order/bulk"
 ******************************************************************************/
router.post('/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bulkOrders: OrderPost[] = req.body;
    const orders = await operationsService.postBulkOrders(bulkOrders);
    res.status(CREATED).json({
      message: 'Orders Posted',
      orders,
    });
  } catch (err) {
    logger.error(err);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

/*******************************************************************************
 *                       Cancel All Orders - "DELETE /api/order/all"
 ******************************************************************************/
router.delete('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await operationsService.cancelAll();
    res.status(CREATED).json({
      message: 'Orders Canceled',
      orders,
    });
  } catch (err) {
    logger.error(err);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

/*******************************************************************************
 *                       Cancel Order - "DELETE /api/order/ORDER_ID"
 ******************************************************************************/
router.delete('/:orderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId;
    const order = await operationsService.cancelOrder({ orderID: orderId });
    res.status(CREATED).json({
      message: 'Order canceled',
      order,
    });
  } catch (err) {
    logger.error(err);
    next(new HTTPError(err.message, INTERNAL_SERVER_ERROR));
  }
});

export default router;
