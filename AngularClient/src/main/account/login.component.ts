import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../core/auth.service";
import { NotificationService } from "../core/notification.service";

@Component({
    selector: "login",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})
export class LoginComponent {

    get isBusy(): boolean {
        return this.authService.isBusy;
    }
    password = "";
    rememberMe = true;
    username: string;

    constructor(private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router) {
    }

    login() {

        if (this.username !== "" && this.password !== "") {
            this.authService.login(this.username, this.password, this.rememberMe)
                .subscribe(() => {

                    this.notificationService.notification.next("You have been logged in!");

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.authService.loginReturnUrl || "/app/home";
                    this.authService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
                });
        }
    }
}
