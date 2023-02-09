import express from 'express';
import path from 'path';
// const { logger } = require('@magma-app/magma-utils');

import auth from '../controllers/auth';

const router = express.Router();

router.use('/o/oauth2/v2/auth', auth);

router.get('/favicon.ico', (req, res) => res.status(204).end());
router.get('/status', (req, res) => res.status(200).send({ message: 'ok' }));

// fallback
router.all('*', (req, res) => res.sendFile(path.resolve('public/404.html')));

export default router;
