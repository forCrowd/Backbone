import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { timer as observableTimer } from "rxjs";

import { AccountService } from "./account.service";
import { NotificationService } from "backbone-client-core";

@Component({
  selector: "confirm-email",
  templateUrl: "confirm-email.component.html",
  styleUrls: ["confirm-email.component.css"]
})
export class ConfirmEmailComponent implements OnInit {

  get isBusy(): boolean {
    return this.accountService.isBusy;
  }

  constructor(private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  resendConfirmationEmail() {

    this.accountService.resendConfirmationEmail()
      .subscribe(() => {
        this.notificationService.notification.next("Confirmation email has been resent to your email address!");
      });
  }

  ngOnInit() {

    // Todo This timer silliness is necessary probably cos of this issue: https://github.com/angular/angular/issues/15634
    observableTimer(0).subscribe(() => {

      // Get token
      const token = this.activatedRoute.snapshot.params["token"];

      // Validate
      if (!token) {
        return;
      }

      // Confirm
      this.accountService.confirmEmail({ Token: token })
        .subscribe(() => {
          this.notificationService.notification.next("Your email address has been confirmed!");
          this.router.navigate(["/app/account"]);
        });
    });
  }
}
