import {
  Element, ElementCell, ElementField, ElementItem, Project, Role, User, UserClaim, UserElementCell,
  UserElementField, UserLogin, UserRole
} from "../entities";

export class EntityManagerConfig {

  constructor(public elementType?: any,
    public elementCellType?: any,
    public elementFieldType?: any,
    public elementItemType?: any,
    public projectType?: any,
    public roleType?: any,
    public userType?: any,
    public userClaimType?: any,
    public userElementCellType?: any,
    public userElementFieldType?: any,
    public userLoginType?: any,
    public userRoleType?: any) {

    if (!this.elementType) this.elementType = Element;
    if (!this.elementCellType) this.elementCellType = ElementCell;
    if (!this.elementFieldType) this.elementFieldType = ElementField;
    if (!this.elementItemType) this.elementItemType = ElementItem;
    if (!this.projectType) this.projectType = Project;
    if (!this.roleType) this.roleType = Role;
    if (!this.userType) this.userType = User;
    if (!this.userClaimType) this.userClaimType = UserClaim;
    if (!this.userElementCellType) this.userElementCellType = UserElementCell;
    if (!this.userElementFieldType) this.userElementFieldType = UserElementField;
    if (!this.userLoginType) this.userLoginType = UserLogin;
    if (!this.userRoleType) this.userRoleType = UserRole;
  }
}
