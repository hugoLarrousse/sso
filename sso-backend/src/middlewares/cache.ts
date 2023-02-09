import redis from '../services/redis';
import { Response, CustomRequest, NextFunction } from '../interfaces/http';

type objType = 'fields' | 'query' | 'params' | 'body';

const routeKeyToRedisInfo = {
  'get/api/user-dashboard/public/sign-up-helpee': {
    prefix: 'public-sign-up-helpee',
    userKey: 'campaignUuid',
    obj: 'fields',
  },
  'get/api/user-dashboard/public/sign-up-helpee/campaigns': {
    prefix: 'public-sign-up-helpee-campaigns',
    userKey: 'organizationUuid',
    obj: 'fields',
  },
} as any;

const getByRouteKey = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!redis || !req.routeKey) return next();

  const redisInfo = routeKeyToRedisInfo[req.routeKey] || null as any;
  if (!redisInfo) return next();

  const id = req[redisInfo.obj as objType][redisInfo.userKey];
  if (!id) return next();

  const value = await redis.get(`${redisInfo.prefix}:${id}`) as string;

  return value ? res.send(JSON.parse(value)) : next();
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getByRouteKey,
};
