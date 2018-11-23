import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, NotificationService } from "backbone-client-core";
import { timer as observableTimer } from "rxjs";


@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnInit {

  get isBusy(): boolean {
    return this.authService.isBusy;
  }
  password = "";
  rememberMe = true;
  username: string;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router) {
      this.activatedRoute.url.subscribe(url =>{
        if(this.authService.loginReturnUrl === "/app/account" && url[2].path === "login")
          this.authService.loginReturnUrl = "";
      });
  }

  login() {

    if (this.username !== "" && this.password !== "") {
      this.authService.login(this.username, this.password, this.rememberMe)
        .subscribe(() => {

          this.notificationService.notification.next("You have been logged in!");

          // Get return url, reset loginReturnUrl and navigate
          //TODO: Check this?
          const returnUrl = this.authService.loginReturnUrl === "" ? `/users/${this.username}` : this.authService.loginReturnUrl ;
          this.authService.loginReturnUrl = "";
          this.router.navigate([returnUrl]);
        });
    }
  }

  ngOnInit(): void {

    // Todo This timer silliness is necessary probably cos of this issue: https://github.com/angular/angular/issues/15634
    observableTimer(0).subscribe(() => {

      // Error
      const error = this.activatedRoute.snapshot.params["error"];

      if (error) {
        this.notificationService.notification.next(error);
        return;
      }

    });
  }
}
