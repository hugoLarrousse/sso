import express from 'express';
import path from 'path';

import { Response, CustomRequest } from '../interfaces/http';

const MAX_AGE_TOKEN = 2.592e+9; // 30 days
const isProduction = process.env.NODE_ENV === 'production';

const router = express.Router();

let password = '';

// random uuid with Math
const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// get test
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const {
      client_id: clientId, redirect_uri: redirectUri, response_type: responseType, scope, state,
    } = req.query;

    if (!clientId) {
      throw new Error('Missing client_id');
    }
    if (!redirectUri) {
      throw new Error('Missing redirect_uri');
    }
    if (!responseType) {
      throw new Error('Missing response_type');
    }
    if (!scope) {
      throw new Error('Missing scope');
    }
    if (!state) {
      throw new Error('Missing state');
    }

    // check if authenticated
    if (req.session.user) {

    }

    // res.cookie('Authorization', jwtToken, { maxAge: MAX_AGE_TOKEN, httpOnly: true, sameSite: 'none', secure: isProduction });
    // res.send({ jwtToken, user });
  } catch (error: any) {
    res.status(400).send({ error: true, errorType: 'ERROR-JWT-TOKEN-ADMIN', message: error.message });
  }
});

router.get('/login', async (req: CustomRequest, res: Response) => {
  if (req.session.uuid) {
    if (req.query.redirectUri === 'connected1') {
      return res.redirect(`connected/1/${password}`);
    }
    return res.redirect(`connected/2/${password}`);
    // return res.redirect('protected');
  }
  res.setHeader('Content-Security-Policy', 'script-src \'unsafe-inline\'');
  return res.sendFile(path.resolve('public/login.html'));
});

router.get('/connected/:id/:type', async (req: CustomRequest, res: Response) => {
  console.log(req.params.type);
  const { type } = req.params;
  // add Cross-Origin-Embedder-Policy
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  // authorize https://kit.fontawesome.com/49f2305173.js
  res.setHeader('Content-Security-Policy', 'script-src \'unsafe-inline\' https://kit.fontawesome.com/49f2305173.js');
  if (req.params.id === '1') {
    console.log('IN2');
    return res.sendFile(path.resolve(`public/connected-1-${type}.html`));
  }
  if (req.params.id === '2') {
    console.log('INNN');
    return res.sendFile(path.resolve(`public/connected-2-${type}.html`));
  }
});

router.post('/user', (req: CustomRequest, res: Response) => {
  if (req.body.email && req.body.password) {
    req.session.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    req.session.cookie.maxAge = MAX_AGE_TOKEN;

    const pwd = req.body.password;
    console.log('pwd', pwd);
    console.log('req.body.redirectUri', req.body.redirectUri);
    password = pwd;
    if (req.body.redirectUri === 'connected1') {
      res.redirect(`connected/1/${pwd}`);
    }
    if (req.body.redirectUri === 'connected2') {
      res.redirect(`connected/2/${pwd}`);
    }
  } else {
    res.send({ error: true, message: 'Invalid username or password' });
  }
});

router.get('/sign-up', (req: CustomRequest, res: Response) => {
  if (req.session.uuid) {
    return res.redirect('protected');
  }
  res.setHeader('Content-Security-Policy', 'script-src \'unsafe-inline\'');
  return res.sendFile(path.resolve('public/sign-up.html'));
});

router.post('/sign-up', (req: CustomRequest, res: Response) => {
  console.log(req.body);
  const pwd = req.body.password;
  password = pwd;

  req.session.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  req.session.cookie.maxAge = MAX_AGE_TOKEN;
  if (req.body.redirectUri === 'connected1') {
    res.redirect(`connected/1/${pwd}`);
  }
  if (req.body.redirectUri === 'connected2') {
    res.redirect(`connected/2/${pwd}`);
  }
  // if (req.body.username && req.body.password) {
  //   // req.session.uuid = uuid;
  //   // req.session.cookie.maxAge = MAX_AGE_TOKEN;

  //   // res.redirect('protected');
  // } else {
  //   res.send('Invalid username or password');
  // }
  // res.send({ error: true, message: 'Invalid username or password' })
});

router.get('/protected', (req: CustomRequest, res: Response) => {
  if (req.session.uuid) {
    res.send('Welcome User, you are on the protected page, <a href=\'logout\'>click to logout</a>');
  } else {
    res.redirect('login');
  }
});

router.get('/logout', async (req, res) => {
  req.session?.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('login');
    }
  });
});

export default router;
