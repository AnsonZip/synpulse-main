import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
const transactionController: TransactionController = new TransactionController();
import auth from '../middleware/jwt.middlewate';

const router: Router = Router();

router.get('/ping', auth, transactionController.healthCheck);
router.post('/producer', transactionController.producer);
router.post('/consume', transactionController.consume);

export default router;
