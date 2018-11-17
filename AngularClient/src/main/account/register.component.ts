import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { environment } from "../../environments/environment";
import { AuthService, NotificationService, getUniqueEmail, getUniqueUserName, stripInvalidChars } from "backbone-client-core";

@Component({
  selector: "register",
  templateUrl: "register.component.html",
  styleUrls: ["register.component.css"]
})
export class RegisterComponent implements OnInit {

  bindingModel = {
    get UserName(): string {
      return this.fields.userName;
    },
    set UserName(value: string) {
      this.fields.userName = stripInvalidChars(value);
    },
    Email: "",
    Password: "",
    ConfirmPassword: "",
    fields: {
      userName: ""
    }
  };
  get isBusy(): boolean {
    return this.authService.isBusy;
  }
  rememberMe = true;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router) {
  }

  ngOnInit(): void {
    // Generate test data if localhost
    if (environment.name === "Development") {
      this.bindingModel.UserName = getUniqueUserName();
      this.bindingModel.Email = getUniqueEmail();
      this.bindingModel.Password = "123qwe";
      this.bindingModel.ConfirmPassword = "123qwe";
    }
  }

  register() {

    this.authService.register(this.bindingModel, this.rememberMe)
      .subscribe(() => {
        this.notificationService.notification.next("You have been registered!");
        this.router.navigate(["/app/account/confirm-email"]);
      });
  }
}
