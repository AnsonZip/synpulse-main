import cors from 'cors';
import * as express from 'express';
import passport from 'passport';
import path from 'path';
import errorMiddleware from './middleware/error.middleware';
import './utils/jwt.utils';
import routes from './routes';

const app = express.default();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/', routes);

app.use('/', errorMiddleware);

export default app;
