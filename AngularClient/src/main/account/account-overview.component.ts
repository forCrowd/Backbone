import { Component } from "@angular/core";

import { AuthService } from "../core/auth.service";
import { User } from "../core/entities/user";

@Component({
    selector: "account-overview",
    templateUrl: "account-overview.component.html"
})
export class AccountOverviewComponent {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    get displayConfirmEmail(): boolean {
        return !(this.currentUser.EmailConfirmed
            || (this.currentUser.Roles[0].Role.Name === "Guest"
                && !this.currentUser.EmailConfirmationSentOn));
    }

    constructor(private authService: AuthService) { }
}
