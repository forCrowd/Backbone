import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { AuthService, NotificationService, User } from "@forcrowd/backbone-client-core";
import { flatMap, map } from "rxjs/operators";

import { AccountService } from "./account.service";
import { AccountRemoveConfirmComponent } from "./account-delete-confirm.component";

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

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router) { }

  deleteAccount() {

    const dialogRef = this.dialog.open(AccountRemoveConfirmComponent)
    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      this.accountService.deleteAccount().pipe(flatMap(() => {
        this.notificationService.notification.next("Your account has been deleted!");
        return this.authService.init().pipe(map(() => {
          this.router.navigate(["/"]);
        }));
      })).subscribe();

    });

  }
}
