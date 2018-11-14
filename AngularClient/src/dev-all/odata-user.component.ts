import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppSettings } from "../app-settings/app-settings";
import { User, AuthService } from "forcrowd-backbone";

@Component({
  selector: "odata-user",
  templateUrl: "odata-user.component.html"
})
export class ODataUserComponent {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {
  }

  getUserAnother(): void {
    this.getUser("sample");
  }

  getUserOwn(): void {
    this.getUser(this.currentUser.UserName);
  }

  private getUser(username: string): void {

    const url = `${AppSettings.serviceODataUrl}/Users?$filter=UserName eq '${username}'&$expand=ProjectSet`;

    this.httpClient.get(url)
      .subscribe((response) => {
        var results = (response as any).value;
        var user = results[0];
        console.log("id - username - email - createdon", user.Id, user.UserName, user.Email, user.CreatedOn, user);
      });
  }
}
