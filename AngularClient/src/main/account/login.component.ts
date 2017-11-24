import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../core/auth.service";
import { NotificationService } from "../core/notification.service";

@Component({
    selector: "login",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnDestroy, OnInit {

    error: string;
    get isBusy(): boolean {
        return this.authService.isBusy;
    }
    init: string;
    password = "";
    rememberMe = true;
    singleUseToken: string;
    subscriptions: Subscription[] = [];
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

    ngOnInit() {

        // Error
        this.error = this.activatedRoute.snapshot.params["error"];

        if (this.error) {
            this.notificationService.notification.next(this.error);
            return;
        }

        this.init = this.activatedRoute.snapshot.params["init"];
        this.singleUseToken = this.activatedRoute.snapshot.params["token"];

        this.tryExternalLogin();
    }

    /**
     * External (single use token) login
     */
    tryExternalLogin() {

        if (!this.singleUseToken) {
            return;
        }

        this.authService.login("", "", this.rememberMe, this.singleUseToken)
            .subscribe(() => {
                this.notificationService.notification.next("You have been logged in!");

                // First time
                if (this.init) {
                    this.router.navigate(["/app/account/change-username", { init: true }]);

                } else {

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.authService.loginReturnUrl || "/app/home";
                    this.authService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
                }
            },
            () => {
                this.notificationService.notification.next("Invalid token"); // Todo error!
            });
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
}
