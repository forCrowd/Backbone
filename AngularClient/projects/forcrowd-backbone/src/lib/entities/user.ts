import { EntityBase } from "./entity-base";
import { Project } from "./project";
import { UserClaim } from "./user-claim";
import { UserElementCell } from "./user-element-cell";
import { UserElementField } from "./user-element-field";
import { UserLogin } from "./user-login";
import { UserRole } from "./user-role";
import { Token } from "../token";
import { stripInvalidChars } from "../utils";

export class User extends EntityBase {

  // Server-side
  Id = 0;
  EmailConfirmed = false;
  EmailConfirmationSentOn: Date | null;
  SingleUseToken: string = null;
  HasPassword = false;
  PhoneNumber = "";
  PhoneNumberConfirmed = false;
  TwoFactorEnabled = false;
  AccessFailedCount = 0;
  LockoutEnabled = false;
  LockoutEndDateUtc: Date = null;
  Notes = "";
  Claims: UserClaim[];
  Logins: UserLogin[];
  Roles: UserRole[];
  ProjectSet: Project[];
  UserElementFieldSet: UserElementField[];
  UserElementCellSet: UserElementCell[];

  // Client-side
  token: Token = null;

  get Email(): string {
    return this.fields.email;
  }
  set Email(value: string) {
    this.fields.email = value.trim();
  }

  get FirstName(): string {
    return this.fields.firstName;
  }
  set FirstName(value: string) {
    this.fields.firstName = value ? value.trim() : null;
  }

  get MiddleName(): string {
    return this.fields.middleName;
  }
  set MiddleName(value: string) {
    this.fields.middleName = value ? value.trim() : null;
  }

  get LastName(): string {
    return this.fields.lastName;
  }
  set LastName(value: string) {
    this.fields.lastName = value ? value.trim() : null;
  }

  get UserName(): string {
    return this.fields.userName;
  }
  set UserName(value: string) {
    this.fields.userName = stripInvalidChars(value);
  }

  get userText(): string {

    if (!this.initialized) {
      return "";
    }

    let userText = this.UserName;

    if (this.Roles.length > 0) {
      userText += ` (${this.Roles[0].Role.Name})`;
    }

    return userText;
  }

  private fields: {
    email: string,
    firstName: string,
    lastName: string,
    middleName: string,
    userName: string,
  } = {
      email: "",
      firstName: null,
      lastName: null,
      middleName: null,
      userName: "",
    };

  isAuthenticated(): boolean {
    return this.Id > 0;
  }

  isAdmin(): boolean {

    if (!this.initialized) {
      return false;
    }

    return this.Roles[0].Role.Name === "Administrator";
  }
}
