import express, { Express } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import path from 'path';

import { sequelize } from './models';
// use session store connect-session-sequelize

import routes from './routes/index';
import expressMetrics from './utils/express-metrics';

const SequelizeStore = connectSessionSequelize(session.Store);

const app: Express = express();

app.use(helmet());

const oneDay = 1000 * 60 * 60 * 24;

const myStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
  expiration: 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
});

app.use(session({
  secret: 'azodkopazkd8Z97DZdzadaz',
  resave: false,
  saveUninitialized: false,
  // proxy: true,
  store: myStore,
  cookie: { maxAge: oneDay },
}));

myStore.sync();

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
}));

app.use('/', routes);

export default app;
