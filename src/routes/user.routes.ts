import { Router } from 'express';
import UserController from '../controllers/user.controller';
import TransactionController from '../controllers/transaction.controller';
const userController: UserController = new UserController();
const transactionController: TransactionController = new TransactionController();

const router: Router = Router();

router.get('/ping', userController.healthCheck);
router.post('/', userController.create);
router.post('/producer', userController.producer);
router.post('/consume', transactionController.consume);
router.post('/createTopic', userController.createTopic);

export default router;
