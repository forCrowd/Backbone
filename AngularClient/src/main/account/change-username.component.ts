import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppSettings } from "../../app-settings/app-settings";
import { AccountService } from "./account.service";
import { AuthService } from "../core/auth.service";
import { NotificationService } from "../core/notification.service";
import { getUniqueUserName, stripInvalidChars } from "../shared/utils";

@Component({
    selector: "change-username",
    templateUrl: "change-username.component.html",
    styleUrls: ["change-username.component.css"]
})
export class ChangeUserNameComponent implements OnInit {

    bindingModel = {
        get UserName(): string {
            return this.fields.userName;
        },
        set UserName(value: string) {
            this.fields.userName = stripInvalidChars(value);
        },
        fields: {
            userName: ""
        }
    };
    get isBusy(): boolean {
        return this.accountService.isBusy || this.authService.isBusy;
    }

    constructor(private accountService: AccountService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router) {
    }

    cancel() {
        // To be able to pass CanDeactivate
        this.bindingModel.UserName = this.authService.currentUser.UserName;

        // Get return url, reset loginReturnUrl and navigate
        const returnUrl = this.authService.loginReturnUrl || "/app/account";
        this.authService.loginReturnUrl = "";
        this.router.navigate([returnUrl]);
    }

    canDeactivate() {
        if (this.bindingModel.UserName === this.authService.currentUser.UserName) {
            return true;
        }

        return confirm("Discard changes?");
    }

    changeUserName() {

        this.accountService.changeUserName(this.bindingModel)
            .subscribe(() => {
                this.notificationService.notification.next("Your username has been changed!");

                // Get return url, reset loginReturnUrl and navigate
                const returnUrl = this.authService.loginReturnUrl || "/app/account";
                this.authService.loginReturnUrl = "";
                this.router.navigate([returnUrl]);
            });
    }

    ngOnInit(): void {

        // User name
        this.bindingModel.UserName = this.authService.currentUser.UserName;

        // Generate test data if localhost
        if (AppSettings.environment === "Development") {
            this.bindingModel.UserName = getUniqueUserName();
        }
    }

    submitDisabled() {
        return this.bindingModel.UserName === this.authService.currentUser.UserName || this.isBusy;
    }
}
