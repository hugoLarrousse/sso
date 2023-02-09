import { UserRoleInterface } from '../interfaces/userRole';

const roleNameToId = {
    admin: 1,
    'super-admin': 2,
}

const convertRoleToPlainFields = (userRoles: UserRoleInterface[] | undefined) => {
  const rolesNamesToReturn = {
    isAdmin: false,
    isSuperAdmin: false,
  };
  if (!userRoles?.[0]) return rolesNamesToReturn;

  for (const userRole of userRoles) {
      if (userRole.roleId === 1) {
        rolesNamesToReturn.isAdmin = true;
      }
      if (userRole.roleId === 2) {
        rolesNamesToReturn.isSuperAdmin = true;
      }
  }

  return rolesNamesToReturn;
};

export { roleNameToId, convertRoleToPlainFields }