import { Component } from "@angular/core";

import { AuthService } from "../core/auth.service";

@Component({
    selector: "social-logins",
    templateUrl: "social-logins.component.html",
    styleUrls: ["social-logins.component.css"]
})
export class SocialLoginsComponent {

    constructor(private authService: AuthService) { }

    getExternalLoginUrl(provider: string): string {
        return this.authService.getExternalLoginUrl(provider);
    }
}
