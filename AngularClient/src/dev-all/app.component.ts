import { Component } from "@angular/core";

import { User } from "forcrowd-backbone";
import { AuthService } from "../main/core/core.module";

@Component({
  selector: "app",
  styleUrls: ["app.component.css"],
  templateUrl: "app.component.html"
})
export class AppComponent {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  constructor(private authService: AuthService) {
  }

  login(): void {
    this.authService.ensureAuthenticatedUser().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.authService.setCurrentUser().subscribe();
  }
}
