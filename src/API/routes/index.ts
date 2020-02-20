import { Router, Request, Response } from 'express';
import OrdersRouter from './Order';
import FundsRouter from './Funds';
import PositionRouter from './Position';
import DataRouter from './Data';

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
router.use('/position', PositionRouter);
router.use('/data', DataRouter);

export default router;
