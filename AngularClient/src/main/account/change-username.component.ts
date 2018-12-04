import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, NotificationService, getUniqueUserName, stripInvalidChars } from "@forcrowd/backbone-client-core";

import { settings } from "../../settings/settings";
import { AccountService } from "./account.service";

@Component({
  selector: "change-username",
  templateUrl: "change-username.component.html"
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
    this.router.navigateByUrl(returnUrl);
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
        this.router.navigateByUrl(returnUrl);
      });
  }

  ngOnInit(): void {

    // User name
    this.bindingModel.UserName = this.authService.currentUser.UserName;

    // Generate test data if localhost
    if (settings.environment === "Development") {
      this.bindingModel.UserName = getUniqueUserName();
    }
  }

  submitDisabled() {
    return this.bindingModel.UserName === this.authService.currentUser.UserName || this.isBusy;
  }
}
