import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Angulartics2GoogleAnalytics } from "angulartics2";
import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

import { AppSettings } from "../../../app-settings/app-settings";
import { User } from "../entities/user";
import { AuthService } from "../auth.service";
import { NotificationService } from "../notification.service";

@Component({
  selector: "core",
  templateUrl: "core.component.html",
  styleUrls: ["core.component.css"]
})
export class CoreComponent implements OnDestroy, OnInit {

  appVersion = AppSettings.version;
  currentUser: User = null;
  hideGuestAccountInfoBox: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private notificationService: NotificationService,
    private titleService: Title,
    private router: Router) {
    this.currentUser = this.authService.currentUser;
  }

  closeGuestAccountInfoBox(): void {
    this.hideGuestAccountInfoBox = true;
  }

  logout(): void {
    this.authService.logout();

    this.authService.setCurrentUser().subscribe(() => {
      this.router.navigate([""]);
    });
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {

    // Title
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === "primary"),
      mergeMap(route => route.data), )
      .subscribe(data => {
        if (data.title) {
          this.titleService.setTitle(`Backbone - ${data.title}`);
        }
      });

    // Notifications
    const notificationSubscription = this.notificationService.notification.subscribe(message => {
      this.matSnackBar.open(message, "", { duration: 2000 });
    });
    this.subscriptions.push(notificationSubscription);

    // Current user changed subscription
    const currentUserChangedSubscription = this.authService.currentUserChanged.subscribe(currentUser => {
      this.currentUser = currentUser;
      this.hideGuestAccountInfoBox = true;
    });
    this.subscriptions.push(currentUserChangedSubscription);
  }

  showGuestAccountInfoBox(): void {
    this.hideGuestAccountInfoBox = false;
  }
}
