import { Router, Request, Response } from 'express';
import OrdersRouter from './Order';
import FundsRouter from './Funds';

const router = Router();

router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    serverTime: new Date()
  });
});

// Add sub-routes
router.use('/order', OrdersRouter);
router.use('/funds', FundsRouter);

export default router;
