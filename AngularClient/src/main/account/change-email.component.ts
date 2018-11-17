import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { AccountService } from "./account.service";
import { getUniqueEmail } from "backbone-client-core";

@Component({
  selector: "change-email",
  templateUrl: "change-email.component.html",
  styleUrls: ["change-email.component.css"]
})
export class ChangeEmailComponent implements OnInit {

  bindingModel = {
    Email: ""
  };
  get isBusy(): boolean {
    return this.accountService.isBusy;
  }

  constructor(private accountService: AccountService, private router: Router) {
  }

  cancel() {
    // To be able to pass CanDeactivate
    this.bindingModel.Email = "";

    this.router.navigate(["/app/account"]);
  }

  canDeactivate() {
    if (this.bindingModel.Email === "") {
      return true;
    }

    return confirm("Discard changes?");
  }

  changeEmail() {

    this.accountService.changeEmail(this.bindingModel)
      .subscribe(() => {
        this.bindingModel.Email = "";
        this.router.navigate(["/app/account/confirm-email"]);
      });
  }

  ngOnInit(): void {

    // Generate test data if localhost
    if (environment.name === "Development") {
      this.bindingModel.Email = getUniqueEmail();
    }
  }
}
