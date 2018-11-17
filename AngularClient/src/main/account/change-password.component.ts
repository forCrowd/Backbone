import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "backbone-client-core";

import { environment } from "../../environments/environment";
import { AccountService } from "./account.service";

@Component({
  selector: "change-password",
  templateUrl: "change-password.component.html",
  styleUrls: ["change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {

  bindingModel = {
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: ""
  };
  get isBusy(): boolean {
    return this.accountService.isBusy;
  }

  constructor(private accountService: AccountService, private notificationService: NotificationService, private router: Router) {
  }

  cancel() {
    this.reset();
    this.router.navigate(["/app/account"]);
  }

  canDeactivate() {
    if (this.bindingModel.CurrentPassword === ""
      && this.bindingModel.NewPassword === ""
      && this.bindingModel.ConfirmPassword === "") {
      return true;
    }

    return confirm("Discard changes?");
  }

  changePassword() {

    this.accountService.changePassword(this.bindingModel)
      .subscribe(() => {
        this.notificationService.notification.next("Your password has been changed!");
        this.reset();
        this.router.navigate(["/app/account"]);
      });
  }

  ngOnInit(): void {

    // Generate test data if localhost (only works for the first time :o))
    if (environment.name === "Development") {
      this.bindingModel.CurrentPassword = "123qwe";
      this.bindingModel.NewPassword = "qwe123";
      this.bindingModel.ConfirmPassword = "qwe123";
    }
  }

  reset(): void {
    this.bindingModel.CurrentPassword = "";
    this.bindingModel.NewPassword = "";
    this.bindingModel.ConfirmPassword = "";
  }
}
