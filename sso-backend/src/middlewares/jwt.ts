import { logger } from '@magma-app/magma-utils';

import * as JWT from '../utils/jwt';
import * as Users from '../services/users';
import * as AdminUsers from '../services/admin-saas/admin-users';

import { CustomRequest, Response, NextFunction } from '../interfaces/http';

const _getUserFromToken = async (token: string, needAdminCheck = false, needSuperAdminCheck = false) => {
  const decodedToken = await JWT.verifyToken(token);
  if (!decodedToken) throw Error('no decoded token');

  const user = (needAdminCheck || needSuperAdminCheck)
    ? await AdminUsers.getOneByIdFromJWT(decodedToken.id)
    : await Users.getOneByIdFromJWT(decodedToken.id);

  if (!user) throw Error('no user found');
  if (needAdminCheck && !user.isAdmin && !user.isSuperAdmin) throw Error(`user is not an admin, email: ${user.email}`);
  if (needSuperAdminCheck && !user.isSuperAdmin) throw Error(`user is not a super admin, email: ${user.email}`);

  return user;
};

const pickUpToken = ({ cookies, headers } : CustomRequest, acceptCookie = true) => {
  const token = acceptCookie
    ? (cookies.Authorization || headers?.authorization?.split('Bearer ')?.[1])
    : headers?.authorization?.split('Bearer ')?.[1];
  if (!token) throw Error('no token provided');

  return token;
};

const checkToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = pickUpToken(req);

    req.user = await _getUserFromToken(token);

    Users.updateLastSeen(req.user.id);

    next();
  } catch (error: any) {
    if (error.message !== 'no token provided') {
      logger.error({
        __filename,
        methodName: 'checkToken',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, message: 'ERROR_CHECK_TOKEN' });
  }
};

// same as checkToken but we have to check if it's an admin
const checkTokenAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = pickUpToken(req);

    req.user = await _getUserFromToken(token, true);

    Users.updateLastSeen(req.user.id);

    next();
  } catch (error: any) {
    if (error.message !== 'no token provided') {
      logger.error({
        __filename,
        methodName: 'checkTokenAdmin',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, errorType: 'ERROR_CHECK_TOKEN_ADMIN', message: error.message });
  }
};

const checkTokenSuperAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = pickUpToken(req);

    req.user = await _getUserFromToken(token, false, true);

    Users.updateLastSeen(req.user.id);

    next();
  } catch (error: any) {
    if (error.message !== 'no token provided') {
      logger.error({
        __filename,
        methodName: 'checkTokenSuperAdmin',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, errorType: 'ERROR_CHECK_TOKEN_SUPER_ADMIN', message: error.message });
  }
};

const checkFixedSlackToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const fixedToken = pickUpToken(req, false);

    if (fixedToken !== process.env.FIXED_TOKEN) throw Error('wrong slack token');

    next();
  } catch (error: any) {
    if (error.message !== 'no token provided') {
      logger.error({
        __filename,
        methodName: 'checkFixedSlackToken',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, message: 'ERROR_CHECK_FIXED_SLACK_TOKEN' });
  }
};

const checkFixedCrmToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const fixedCRMToken = req.headers.Authorization || req.headers.authorization;

    if (!fixedCRMToken) throw Error(`no crm token provided ${JSON.stringify(req.headers)}`,);
    if (fixedCRMToken !== process.env.CRM_TOKEN) throw Error('wrong crm token');

    next();
  } catch (error: any) {
    if (!error.message.includes('no token provided')) {
      logger.error({
        __filename,
        methodName: 'checkFixedCrmToken',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, message: 'ERROR_CHECK_FIXED_CRM_TOKEN' });
  }
};

export {
  checkToken as checkJWT,
  checkTokenAdmin as checkJWTAdmin,
  checkTokenSuperAdmin as checkJWTSuperAdmin,
  checkFixedSlackToken,
  checkFixedCrmToken,
};
