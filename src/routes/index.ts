import { Router } from 'express';

import user from './user.routes';

const router: Router = Router();

router.use('/users', user);

export default router;
