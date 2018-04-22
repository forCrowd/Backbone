import { EntityBase } from "./entity-base";
import { User } from "./user";

export class UserClaim extends EntityBase {

    // Server-side
    Id = 0;
    User: User;
    ClaimType = "";
    ClaimValue = "";

}
