import { Router, Request, Response } from 'express';

const router = Router();

router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    serverTime: new Date()
  });
});
// Add sub-routes

export default router;
