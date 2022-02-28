import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
const transactionController: TransactionController = new TransactionController();
import auth from '../middleware/jwt.middlewate';

const router: Router = Router();

/**
 * @openapi
 * /ping:
 *   get:
 *     description: Health Check Api
 *     responses:
 *       200:
 *         description: Returns a pong string.
 */
router.get('/ping', transactionController.healthCheck);

/**
 * @openapi
 * /producer:
 *   post:
 *     description: Create producer and cast transactions to topic base on user identity and currency
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a success message.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *       403:
 *         description: Unauthorized.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 */
router.post('/producer', auth, transactionController.producer);

/**
 * @openapi
 * /consume:
 *   post:
 *     description: Create consumer and get transactions base on user identity and currency
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns transaction list.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *       403:
 *         description: Unauthorized.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *                  numOfRecords:
 *                    type: number
 *                    description: number of record that consumer received
 *                  data:
 *                    type: array
 *                    description: transactions that consumer received
 *                    items:
 *                      type: object
 *                      properties:
 *                        currency:
 *                          type: string
 *                          description: Currency of the account
 *                        amount:
 *                          type: number
 *                          description: Total amount of the currency account
 *                        transactions:
 *                          type: array
 *                          description: transactions under this currency account
 *                          items:
 *                              type: object
 *                              properties:
 *                                id: 
 *                                  type: string
 *                                  description: key of the record
 *                                identifier:
 *                                  type: string
 *                                  description: Unique identifier
 *                                currency:
 *                                  type: string
 *                                  description: Currency of the transaction
 *                                amount:
 *                                  type: number
 *                                  description: Amount of the transaction
 *                                iban:
 *                                  type: string
 *                                  description: Account IBAN
 *                                date:
 *                                  type: string
 *                                  description: Date of transaction
 *                                description:
 *                                  type: string
 *                                  description: Description of transaction
 */
router.post('/consume', auth, transactionController.consume);

export default router;
