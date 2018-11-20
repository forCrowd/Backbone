import { Component } from "@angular/core";
import { User, AuthService } from "backbone-client-core";

@Component({
  selector: "landing-page",
  templateUrl: "landing-page.component.html",
})
export class LandingPageComponent {
  currentUser: User = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
  }

  isLogedIn(): boolean {
    if (this.authService.currentUser === null) {
      return false;
    } else {
      return this.authService.currentUser.isAuthenticated();
    }
  }

}
