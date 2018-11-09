import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AccountService } from "./account.service";
import { NotificationService } from "../core/core.module";

@Component({
  selector: "add-password",
  templateUrl: "add-password.component.html",
  styleUrls: ["add-password.component.css"]
})
export class AddPasswordComponent {

  get isBusy(): boolean {
    return this.accountService.isBusy;
  }
  model: any = { Password: "", ConfirmPassword: "" };

  constructor(private accountService: AccountService, private router: Router, private notificationService: NotificationService) {
  }

  addPassword() {

    // Todo password match validation?

    this.accountService.addPassword(this.model)
      .subscribe(() => {
        this.notificationService.notification.next("Your password has been set!");
        this.reset();
        this.router.navigate(["/app/account"]);
      });
  }

  cancel() {
    this.reset();
    this.router.navigate(["/app/account"]);
  }

  canDeactivate() {
    if (this.model.Password === ""
      && this.model.ConfirmPassword === "") {
      return true;
    }

    return confirm("Discard changes?");
  }

  reset(): void {
    this.model.Password = "";
    this.model.ConfirmPassword = "";
  }
}
