import cors from 'cors';
import * as express from 'express';
import passport from 'passport';
import './utils/jwt.utils';
import routes from './routes';

const app = express.default();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/', routes);

export default app;
