import sequelize from 'sequelize';
import { email, phoneNumber } from '@magma-app/magma-utils';

import { models } from '../models';
import * as Upload from './upload';

import { UserInterface } from '../interfaces/user';
import { UserPointInterface } from '../interfaces/userPoint';

import * as language from '../utils/language';
import { convertRoleToPlainFields, roleNameToId } from '../utils/role';
import { convertStringToBoolean } from '../utils/type';
import TokenUtils from '../utils/token';

const _mandatoryFields = ['firstname', 'lastname', 'email'] as const;

const _formatUserWithRoles = (user: UserInterface) => {
  return {
    ...user,
    userRoles: undefined,
    ...convertRoleToPlainFields(user.userRoles),
  };
};

const _checkFields = (user: UserInterface) => {
  for (const mandatoryField of _mandatoryFields) {
    if (!Object.prototype.hasOwnProperty.call(user, mandatoryField) || !user[mandatoryField]) {
      throw new Error(`Missing mandatory field ${mandatoryField}`);
    }
  }

  if (user.phoneNumber && !phoneNumber.format(user.phoneNumber)) {
    throw new Error(`Invalid phone number ${user.phoneNumber}`);
  }
  if (user.email && !email.isValid(user.email)) {
    throw new Error(`Invalid email ${user.email}`);
  }
};

// TODO: to check if complete
const _buildUserObject = async (
  organizationId: number,
  user: UserInterface,
) => {
  return {
    organizationId,
    token: user.token || await TokenUtils.generateOneAsync(),
    firstname: user.firstname,
    lastname: user.lastname,
    phoneNumber: phoneNumber.format(user.phoneNumber),
    email: user.email,
    language: language.isAvailable(user.language) ? user.language : language.defaultOne,
    profilePictureUrl: user.profilePictureUrl || '',
    consentedAt: user.consentedAt || null,
    origin: user.origin || 'unknown',
    shareId: user.shareId || await TokenUtils.generateOneAsyncForSharing(),
    notificationEmail: user.notificationEmail || user.email,
    notificationPhoneNumber: phoneNumber.format(user.notificationPhoneNumber) || phoneNumber.format(user.phoneNumber),
    contactEmail: user.contactEmail,
    activatedEmail: user.activatedEmail,
    activatedPhone: phoneNumber.format(user.activatedPhone) || phoneNumber.format(user.phoneNumber), // TODO: ???
    crmEntryId: user.crmEntryId || '',
  };
};

const updateLastConnection = (userId : number) => {
  return models.User.update({ lastConnection: sequelize.fn('NOW') }, { where: { id: userId } });
};

const updateFirstConnection = (userId : number) => {
  return models.User.update({ firstConnection: sequelize.fn('NOW') }, { where: { id: userId } });
};

const updateLastSeen = (userId : number) => {
  return models.User.update({ lastSeen: sequelize.fn('NOW') }, { where: { id: userId } });
};

const getOneByIdFromJWT = async (userId: number) => {
  const user = await models.User.findOne({
    where: { id: userId },
    include: {
      model: models.UserRole,
      as: 'userRoles',
      required: false,
      where: {
        archivedAt: null,
        roleId: { [sequelize.Op.in]: [roleNameToId.admin, roleNameToId['super-admin']] },
      },
    },
  });
  if (!user) return null;
  if (user.archivedAt) {
    throw Error('user archived');
  }

  return _formatUserWithRoles(user.toJSON());
};

const getOneByEmail = async (emailParam: string, needRoles = false) => {
  if (!emailParam) throw Error('email is not present');

  const formattedEmail = decodeURIComponent(emailParam).trim().toLowerCase();

  const user = await models.User.findOne({
    where: {
      email: {
        [sequelize.Op.iLike]: formattedEmail,
      },
      archivedAt: null,
    },
    include: needRoles ? [{
      model: models.UserRole,
      as: 'userRoles',
      required: false,
      where: {
        archivedAt: null,
      },
    }] : [],
  });
  if (!user) return null;

  return _formatUserWithRoles(user.toJSON());
};

const getOneByToken = async (token: string) => {
  if (!token) throw Error('token is not present');

  const user = await models.User.findOne({
    where: {
      token: {
        [sequelize.Op.iLike]: token.trim(),
      },
    },
    raw: true,
  });

  if (!user) {
    throw Error(`user not found, token: ${token}`);
  }
  if (user.archivedAt) {
    throw Error(`user archived, token: ${token}`);
  }

  return user;
};

// QUESTION:
// should we ask for campaignCriteria?
// TODO: to be improved
const getAllByOrganizationId = async (organizationId: number, {
  needArchived = false,
  needRelations = false,
  needRelationMoments = false,
  needCriteria = false,
  needTouchPoints = false,
  needCampaigns = false,
  needPoints = false,
  needChallenges = false,
  needRewards = false,
  needTags = false,
  needHelpeesExternalStatus = false,
  needAdmins = false,
}) => {
  const users = await models.User.findAll({
    where: {
      organizationId,
      ...needArchived ? {} : { archivedAt: null },
    },
    include: [
      ...(needRelations || needCampaigns) ? [{
        model: models.Relation,
        include: [
          ...needRelationMoments ? [{
            model: models.RelationMoment,
            as: 'RelationMoments',
            where: { archivedAt: null },
            required: false,
            include: {
              model: models.Moment,
            },
          }] : [],
          {
            model: models.Campaign,
          },
        ],
      }] : [],
      ...needCriteria ? [{
        model: models.UserCriteria,
        as: 'userCriteria',
        required: false,
        include: {
          model: models.Criteria,
          as: 'criteria',
        },
      }] : [],
      ...needTouchPoints ? [{
        model: models.UserTouchPoint,
        as: 'userTouchPoints',
        required: false,
        include: {
          model: models.TouchPoint,
        },
      }] : [],
      ...needPoints ? [{
        model: models.UserPoint,
        as: 'helperPoints',
        required: false,
      }] : [],
      ...needChallenges ? [{
        model: models.UserChallenge,
        as: 'userChallenges',
        include: {
          model: models.Challenge,
        },
      }] : [],
      ...needRewards ? [{
        model: models.UserReward,
        as: 'userRewards',
        include: {
          model: models.Reward,
        },
      }] : [],
      ...needTags ? [{
        model: models.UserTag,
        as: 'userTags',
        include: {
          model: models.Tag,
        },
      }] : [],
      ...needHelpeesExternalStatus ? [{
        model: models.HelpeeStatus,
        as: 'helpeeStatuses',
        include: {
          model: models.ExternalStatus,
          as: 'externalStatus',
        },
      }] : [],
      {
        model: models.UserRole,
        as: 'userRoles',
        required: false,
        where: {
          archivedAt: null,
          roleId: { [sequelize.Op.in]: [roleNameToId.admin, roleNameToId['super-admin']] },
        },
      },
    ],
  });

  return users
    .filter((user: UserInterface) => (needAdmins ? true : !user.userRoles?.length))
    .map((user: UserInterface) => _formatUserWithRoles(user.toJSON()))
    .map((user: UserInterface) => {
      return {
        ...user,
        campaigns: needCampaigns && user.relations?.reduce((acc: any, relation: any) => {
          if (!relation.campaign || acc.find((re: any) => re.id === relation.id)) return acc;
          return [...acc, relation.campaign];
        }, []),
        balance: (needPoints && user.helperPoints)
          ? user.helperPoints.reduce((total: number, points: UserPointInterface) => total + (points.points || 0), 0)
          : 0,
      };
    });
};

// TODO: to be improved
const updateFields = async (organizationId: number, userId: number, fields: any) => {
  const user = await models.User.findOne({
    where: {
      id: userId,
      organizationId,
    },
  });
  if (!user) throw Error(`user not found, id: ${userId}, organizationId: ${organizationId}`);

  await user.update({
    firstname: fields.firstname || user.firstname,
    lastname: fields.lastname || user.lastname,
    notificationEmail: fields.notificationEmail || user.notificationEmail,
    acceptEmailNotifications: fields.acceptEmailNotifications !== undefined
      ? convertStringToBoolean(fields.acceptEmailNotifications)
      : user.acceptEmailNotifications,
    acceptPhoneNotifications: fields.acceptPhoneNotifications !== undefined
      ? convertStringToBoolean(fields.acceptPhoneNotifications)
      : user.acceptPhoneNotifications,
    phoneNumber: phoneNumber.format(fields.phoneNumber) || user.phoneNumber,
  });

  return _formatUserWithRoles(user.toJSON());
};

// TODO: to check deeply
const createOne = async (organizationId: number, fields: any, user?: any, allowArchive = false) => {
  _checkFields(fields);

  const userExist = user || await models.User.findOne({
    where: {
      email: {
        [sequelize.Op.iLike]: fields.email.trim(),
      },
      organizationId,
      ...allowArchive ? {} : { archivedAt: null },
    },
  });

  if (userExist && !userExist.archivedAt) throw Error(`user already exist, email: ${fields.email}`);

  const userObject = await _buildUserObject(organizationId, { ...userExist || {}, ...fields, archivedAt: null });

  return models.User.create(userObject, { raw: true }) as UserInterface;
};

const getOneById = async (userId: number, {
  needIsHelper = false,
  needIsHelpee = false,
  needCriteria = false,
  needTouchPoints = false,
  needPoints = false,
} = {}) => {
  const user = await models.User.findOne({
    where: {
      id: userId,
      archivedAt: null,
    },
    include: [
      {
        model: models.Organization,
        as: 'organization',
        attributes: ['name', 'logoUrl', 'notificationEmail', 'rewardEnabled', 'pointEnabled', 'challengeEnabled'],
      },
      ...needIsHelper ? [{
        model: models.Relation,
        as: 'helperRelations',
        attributes: ['id'],
      }] : [],
      ...needIsHelpee ? [{
        model: models.Relation,
        as: 'helpeeRelations',
        attributes: ['id'],
      }] : [],
      ...needCriteria ? [{
        model: models.UserCriteria,
        as: 'userCriteria',
        required: false,
        attributes: ['id', 'criteriaId', 'answerKey', 'answerKeys'],
        include: {
          model: models.Criteria,
          as: 'criteria',
          attributes: ['id', 'labelHelpee', 'labelHelper', 'options', 'type'],
        },
      }] : [],
      ...needTouchPoints ? [{
        model: models.UserTouchPoint,
        as: 'userTouchPoints',
        required: false,
        attributes: ['id', 'value'],
        include: {
          model: models.TouchPoint,
          attributes: ['id', 'name', 'type', 'icon'],
        },
      }] : [],
      ...needPoints ? [{
        model: models.UserPoint,
        as: 'helperPoints',
        required: false,
        attributes: ['points'],
      }] : [],
    ],
  });

  if (!user) throw Error(`user not found, id: ${userId}`);

  return {
    ...user.toJSON(),
    balance: (needPoints && user.helperPoints)
      ? user.helperPoints.reduce((total: number, userPoints: UserPointInterface) => total + (userPoints.points || 0), 0)
      : 0,
    helperPoints: undefined,
    ...needIsHelper ? { isHelper: !!user.helperRelations?.length } : {},
    ...needIsHelpee ? { isHelpee: !!user.helpeeRelations?.length } : {},
    helperRelations: undefined,
    helpeeRelations: undefined,
  } as UserInterface;
};

const updateProfilePicture = async (userId: number, file: Express.Multer.File) => {
  if (!file) throw Error('No file to upload');

  const { location: profilePictureUrl } = file ? await Upload.picture(
    file.buffer,
    file.mimetype,
  ) : { location: '' };

  if (!profilePictureUrl) throw Error('No profilePictureUrl');

  const [isUpdated, [userUpdated]] = await models.User.update({
    profilePictureUrl,
  }, {
    where: {
      id: userId,
    },
    returning: true,
    raw: true,
  });

  if (!isUpdated) throw Error(`user not updated, id: ${userId}`);

  return userUpdated;
};

export {
  updateLastConnection,
  updateFirstConnection,
  updateLastSeen,
  getOneByIdFromJWT,
  getOneByEmail,
  getOneByToken,
  getAllByOrganizationId,
  updateFields,
  createOne,
  getOneById,
  updateProfilePicture,
};
