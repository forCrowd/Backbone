import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, NotificationService, User } from "@forcrowd/backbone-client-core";
import { flatMap, map } from "rxjs/operators";

import { AccountService } from "./account.service";

@Component({
  selector: "account-overview",
  templateUrl: "account-overview.component.html",
  styleUrls: ["account-overview.component.css"]
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

  constructor(private accountService: AccountService, private authService: AuthService, private notificationService: NotificationService, private router: Router) { }

  deleteAccount() {
    this.accountService.deleteAccount().pipe(flatMap(() => {
      this.notificationService.notification.next("Your account has been deleted!");

      return this.authService.init().pipe(map(() => {
        this.router.navigate(["/"]);
      }));
    })).subscribe();
  }
}
