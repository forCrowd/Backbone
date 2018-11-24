import { Component, OnInit } from "@angular/core";
import { User, AuthService } from "backbone-client-core";
import { Subscription } from "rxjs";

@Component({
  selector: "landing-page",
  templateUrl: "landing-page.component.html",
})
export class LandingPageComponent implements OnInit {

  currentUser: User = null;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {

    // Current user changed subscription
    const currentUserChangedSubscription = this.authService.currentUserChanged.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    this.subscriptions.push(currentUserChangedSubscription);

  }
}
