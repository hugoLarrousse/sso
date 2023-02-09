import { Sequelize, Options } from 'sequelize';
import config from 'config';

import logger from '../utils/logger';

import User from './user';
import Client from './client';
import Associations from './_associations';

const postgresURI = process.env.POSTGRES_URI;
if (!postgresURI) {
  throw Error('POSTGRES_URI is not defined');
}

const isDEV = !!process.env.DEV;
if (!isDEV) {
  console.log('Sequelize is not in DEV mode');
}

const options = {
  logging: config.get('sequelize.options.logging') && console.log,
  dialect: 'postgres',
  ...(!process.env.DEV && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
  // logging: true,
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    acquire: 20000,
  },
};

const sequelize = new Sequelize(postgresURI, options as Options);

const createConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info(
      `Connection has been established successfully. database: ${sequelize.getDatabaseName()}`
    );
    return 1;
  } catch (error) {
    logger.error({
      __filename,
      methodName: 'createConnection',
      message: `Unable to connect to the database, ${error}`,
    });
    return 0;
  }
};

const models = {
  User: User(sequelize),
  Client: Client(sequelize),
};

Associations(models);

export {
  createConnection,
  models,
  sequelize,
};
