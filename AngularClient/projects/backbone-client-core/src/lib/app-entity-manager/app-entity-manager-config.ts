import { ElementCell, ElementField, ElementItem, Element, Project, Role, User, UserElementCell, UserElementField,
  UserRole } from "../entities";

export class EntityManagerConfig {
  elementCellType: any = ElementCell;
  elementFieldType: any = ElementField;
  elementItemType: any = ElementItem;
  elementType: any = Element;
  projectType: any = Project;
  roleType: any = Role;
  userType: any = User;
  userElementCellType: any = UserElementCell;
  userElementFieldType: any = UserElementField;
  userRoleType: any = UserRole;
}
