import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
const transactionController: TransactionController = new TransactionController();
import auth from '../middleware/jwt.middlewate';

const router: Router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Health Check Api
 *     responses:
 *       200:
 *         description: Returns a pong string.
 */
router.get('/ping', auth, transactionController.healthCheck);

/**
 * @openapi
 * /:
 *   post:
 *     description: Create producer and cast transactions to topic base on user identity and currency
 *     responses:
 *       200:
 *         description: Returns a success message.
 */
router.post('/producer', auth, transactionController.producer);

/**
 * @openapi
 * /:
 *   get:
 *     description: Create consumer and get transactions base on user identity and currency
 *     responses:
 *       200:
 *         description: Returns transaction list.
 */
router.post('/consume', auth, transactionController.consume);

export default router;
