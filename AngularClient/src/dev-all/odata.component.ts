import { Component } from "@angular/core";
import { AuthService, User } from "backbone-client-core";

@Component({
  selector: "odata",
  templateUrl: "odata.component.html"
})
export class ODataComponent {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  constructor(private authService: AuthService) { }

}
