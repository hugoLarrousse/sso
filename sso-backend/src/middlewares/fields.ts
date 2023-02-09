/* eslint-disable max-len */
import { logger } from '@magma-app/magma-utils';
import { Response, CustomRequest, NextFunction } from '../interfaces/http';

const routes = {
  'post/api/admin-saas/signup': ['firstname', 'lastname', 'email', 'phoneNumber', 'title', 'organizationName', 'consent'],
  'get/api/admin-saas/auth/jwt-token': ['token'],
  'get/api/admin-saas/auth/login': ['email'],
  'put/api/admin-saas/organization': [],
  'post/api/admin-saas/organization/picture': ['urlFieldName'],
  'post/api/admin-saas/team/member': ['firstname', 'lastname', 'email', 'phoneNumber', 'title'],
  'put/api/admin-saas/team/member': ['userId'],
  'put/api/admin-saas/team/member/picture': ['userId'],
  'post/api/admin-saas/challenge': ['name'],
  'put/api/admin-saas/challenge': ['challengeId'],
  'delete/api/admin-saas/challenge': ['challengeId'],
  'post/api/admin-saas/reward': ['name', 'points'],
  'put/api/admin-saas/reward': ['rewardId', 'name', 'points'],
  'delete/api/admin-saas/reward': ['rewardId'],
  'post/api/admin-saas/tag': ['name'],
  'put/api/admin-saas/tag': ['tagId', 'name'],
  'delete/api/admin-saas/tag': ['tagId'],
  'put/api/admin-saas/user': ['userId'],
  'post/api/admin-saas/user': ['firstname', 'lastname'],
  'post/api/admin-saas/points': ['userId', 'points'],
  'delete/api/admin-saas/points': ['userId', 'userPointId'],
  'get/api/admin-saas/campaign/:campaignId': ['campaignId'],
  'post/api/admin-saas/campaign': ['title', 'description'],
  'put/api/admin-saas/campaign': ['campaignId'],
  'delete/api/admin-saas/campaign': ['campaignId'],
  'post/api/admin-saas/campaign/tag': ['tagId', 'campaignId'],
  'delete/api/admin-saas/campaign/tag': ['campaignTagId', 'campaignId'],
  'post/api/admin-saas/campaign/admin': ['adminId', 'campaignId'],
  'post/api/admin-saas/campaign/admins': ['adminIds', 'campaignId'],
  'delete/api/admin-saas/campaign/admin': ['campaignAdminId', 'campaignId'],
  'post/api/admin-saas/campaign/admin/sender': ['adminId', 'campaignId'],
  'get/api/admin-saas/moments/campaign': ['campaignId'],
  'post/api/admin-saas/moment': ['campaignId', 'name', 'index'],
  'put/api/admin-saas/moment': ['campaignId', 'momentId'],
  'delete/api/admin-saas/moment': ['campaignId', 'momentId'],
  'get/api/admin-saas/criteria/:criteriaId': ['criteriaId'],
  'post/api/admin-saas/criteria': ['type', 'options', 'index'],
  'put/api/admin-saas/criteria': ['criteriaId'],
  'delete/api/admin-saas/criteria': ['criteriaId'],
  'get/api/admin-saas/criteria/campaign/:campaignId': ['campaignId'],
  'post/api/admin-saas/criteria/campaign': ['campaignId', 'index', 'type'],
  'put/api/admin-saas/criteria/campaign': ['campaignId', 'campaignCriteriaId'],
  'delete/api/admin-saas/criteria/campaign': ['campaignId', 'campaignCriteriaId'],
  'get/api/admin-saas/touchPoints/campaign/:campaignId': ['campaignId'],
  'post/api/admin-saas/touchPoint/campaign': ['campaignId', 'touchPointId'],
  'put/api/admin-saas/touchPoint/campaign': ['campaignId', 'campaignTouchPointId'],
  'delete/api/admin-saas/touchPoint/campaign': ['campaignId', 'campaignTouchPointId'],
  'get/api/admin-saas/campaign/integration/urls': ['campaignId'],
  'get/api/admin-saas/campaign/launch': ['campaignId'],
  'get/api/admin-saas/campaign/check': ['campaignId'],
  'post/api/admin-saas/campaign/file': ['campaignId', 'type'],
  'get/api/admin-saas/campaign/files': ['campaignId'],
  'delete/api/admin-saas/campaign/file': ['campaignId', 'campaignFileId'],
  'get/api/admin-saas/campaign/campaign-helpers': [],
  'get/api/admin-saas/campaign/campaign-helpers/view/:campaignId': ['campaignId'],
  'get/api/admin-saas/campaign/campaign-relations/view/:campaignId': ['campaignId'],
  'get/api/admin-saas/campaign/campaign-relations/relation/:relationId': ['relationId'],
  'put/api/admin-saas/campaign/campaign-relations/validate/relation-moments/:relationMomentId': ['relationMomentId'],
  'get/api/admin-saas/campaign/campaign-helpers/:campaignId': ['campaignId'],
  'get/api/user-dashboard/auth/jwt-token': ['token'],
  'get/api/user-dashboard/auth/login': ['email'],
  'get/api/user-dashboard/public/sign-in': [],
  'get/api/user-dashboard/public/sign-up-helpee': ['campaignUuid'],
  'get/api/user-dashboard/public/sign-up-helpee/campaigns': ['organizationUuid'],
  'post/api/user-dashboard/campaign-helper/join': ['campaignId'],
  'put/api/user-dashboard/campaign-helper/settings': ['campaignId'],
  'put/api/user-dashboard/user-criteria': ['criteriaId'],
  'put/api/user-dashboard/user-touchPoint': ['touchPointId', 'value'],
  'get/api/user-dashboard/campaign-helper': [],
  'get/api/user-dashboard/user': [],
  'put/api/user-dashboard/user': [],
  'get/api/user-dashboard/user/balance': [],
  'put/api/user-dashboard/user/profile-picture': [],
  'get/api/user-dashboard/campaigns/user/touch-points': [],
  'get/api/user-dashboard/campaigns/user/criteria': [],
  'post/api/sign-up-helpee': ['campaignUuid', 'organizationId', 'firstname', 'lastname', 'email', 'criteriaId'],
  'put/api/sign-up-helpee': ['userId', 'campaignId', 'organizationId'],
  'get/api/matching/jarvis/slack': ['helpeeId'],
  'get/api/matching/jarvis/slack/:email': ['helpeeId', 'campaignId', 'email'],
  'post/api/matching': ['helpeeId', 'campaignId', 'helperId'],
  'get/api/user-dashboard/relations/helper': [],
  'get/api/user-dashboard/relations/helper/:relationId': ['relationId'],
  'post/api/user-dashboard/relations/helper/report': ['relationId', 'reason'],
  'post/api/user-dashboard/relation/helpee/report': ['relationId', 'reason'],
  'get/api/user-dashboard/relation/helpee': [],
  'post/api/user-dashboard/relation-moments/helper/ongoing': ['relationMomentId'],
  'post/api/user-dashboard/relation-moments/helper/done': ['relationMomentId'],
  'post/api/user-dashboard/relation-moments/helper/read': ['relationMomentId'],
  'post/api/user-dashboard/relation-moments/helpee/done': ['relationMomentId', 'rating'],
  'get/api/user-dashboard/rewards': [],
  'get/api/user-dashboard/rewards/purchased': [],
  'post/api/user-dashboard/rewards/:rewardId': ['rewardId'],
  'get/api/user-dashboard/challenges': [],
  'post/api/user-dashboard/challenges/start/:challengeId': ['challengeId'],
  'post/api/user-dashboard/challenges/done/helper/:userChallengeId': ['userChallengeId'],
  'put/api/crm/helpee': ['organizationId'],
  'post/api/crm/lead-ia/helpees': ['helpees'],
  'post/api/crm/oscar/helpee': ['organizationId', 'campaignId', 'email', 'firstname', 'lastname', 'crmEntryId'],

  'post/api/short-url': ['url'],
  'get/:shortUrlId': ['shortUrlId'],

} as { [key: string]: string[] };

const checkFields = (req: CustomRequest, res: Response, next: NextFunction) => {
  const routeKey = `${req.method.toLowerCase()}${req.baseUrl}${(req.route && req.route.path.length > 1) ? req.route.path : ''}` as string;

  const fieldsByRoute = routes[routeKey];
  if (!fieldsByRoute) {
    return res.status(400).send({
      message: `this route: ${routeKey} doesn't exist`,
      error: true,
      errorType: 'WRONG_ROUTE',
    });
  }

  const fields = { ...req.body, ...req.params, ...req.query };
  const fieldsToCheck = Object.keys(fields);

  const missingFields = fieldsByRoute.filter(field => !fieldsToCheck.includes(field));

  if (missingFields.length > 0) {
    logger.error({
      __filename,
      methodName: 'checkFields',
      message: `fields ${missingFields?.join(',')} are missing, ${req.method}${req.baseUrl}${(req.route && req.route.path) || ''}`,
      who: `${req.hostname}${req.originalUrl}, ip: ${req.ip}, fields: ${JSON.stringify({ ...req.body, ...req.params, ...req.query })}`,
    });
    return res.status(400).send({
      message: `fields ${missingFields?.join(',')} are missing`,
      error: true,
      errorType: 'MISSING_FIELDS',
    });
  }
  req.routeKey = routeKey;
  req.fields = fields || {};
  return next();
};

const checkFieldsAsync = (req: CustomRequest, res: Response) => new Promise((resolve, reject) => {
  checkFields(req, res, async (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(true);
    }
  });
});

export {
  checkFields,
  checkFieldsAsync,
};
