import {
  Element, ElementCell, ElementField, ElementItem, Project, Role, User, UserClaim, UserElementCell,
  UserElementField, UserLogin, UserRole
} from "../entities";

export interface IEntityManagerConfig {
  elementType?: typeof Element;
  elementCellType?: typeof ElementCell;
  elementFieldType?: typeof ElementField;
  elementItemType?: typeof ElementItem;
  projectType?: typeof Project;
  roleType?: typeof Role;
  userType?: typeof User;
  userClaimType?: typeof UserClaim;
  userElementCellType?: typeof UserElementCell;
  userElementFieldType?: typeof UserElementField;
  userLoginType?: typeof UserLogin;
  userRoleType?: typeof UserRole;
}

export class EntityManagerConfig {

  elementType = Element;
  elementCellType = ElementCell;
  elementFieldType = ElementField;
  elementItemType = ElementItem;
  projectType = Project;
  roleType = Role;
  userType = User;
  userClaimType = UserClaim;
  userElementCellType = UserElementCell;
  userElementFieldType = UserElementField;
  userLoginType = UserLogin;
  userRoleType = UserRole;

  constructor(config?: IEntityManagerConfig) {
    if (!config) config = {};
    if (config.elementType) this.elementType = config.elementType;
    if (config.elementCellType) this.elementCellType = config.elementCellType;
    if (config.elementFieldType) this.elementFieldType = config.elementFieldType;
    if (config.elementItemType) this.elementItemType = config.elementItemType;
    if (config.projectType) this.projectType = config.projectType;
    if (config.roleType) this.roleType = config.roleType;
    if (config.userType) this.userType = config.userType;
    if (config.userClaimType) this.userClaimType = config.userClaimType;
    if (config.userElementCellType) this.userElementCellType = config.userElementCellType;
    if (config.userElementFieldType) this.userElementFieldType = config.userElementFieldType;
    if (config.userLoginType) this.userLoginType = config.userLoginType;
    if (config.userRoleType) this.userRoleType = config.userRoleType;
  }
}
