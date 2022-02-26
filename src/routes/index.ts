import { Router } from 'express';

import transaction from './transaction.routes';

const router: Router = Router();

router.use('/transactions', transaction);

export default router;
