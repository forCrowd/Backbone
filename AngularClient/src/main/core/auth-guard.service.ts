import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "backbone-client-core";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {

    // Success
    if (this.authService.currentUser.isAuthenticated()) {
      return true;
    }

    // Failure
    this.router.navigate(["/app/account/login", { error: "Please login first!" }]);
    return false;
  }
}
