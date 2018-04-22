import { EntityBase } from "./entity-base";
import { User } from "./user";

export class UserLogin extends EntityBase {

    // Server-side
    Id = 0;
    User: User;
    LoginProvider = "";
    ProviderKey = "";

}
