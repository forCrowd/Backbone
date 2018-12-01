import { ElementCell, ElementField, ElementItem, Element, Project, Role, User, UserClaim, UserElementCell,
  UserElementField, UserLogin, UserRole } from "../entities";

export class EntityManagerConfig {
  elementCellType: any = ElementCell;
  elementFieldType: any = ElementField;
  elementItemType: any = ElementItem;
  elementType: any = Element;
  projectType: any = Project;
  roleType: any = Role;
  userClaim: any = UserClaim;
  userType: any = User;
  userElementCellType: any = UserElementCell;
  userElementFieldType: any = UserElementField;
  userLogin: any = UserLogin;
  userRoleType: any = UserRole;
}
