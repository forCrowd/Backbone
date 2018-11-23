import { Component, OnDestroy, OnInit } from "@angular/core";
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Angulartics2GoogleGlobalSiteTag } from "angulartics2/gst";
import { User, AuthService, NotificationService } from "backbone-client-core";
import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

@Component({
  selector: "core",
  templateUrl: "core.component.html",
  styleUrls: ["core.component.css"]
})
export class CoreComponent implements OnDestroy, OnInit {

  opened = true;
  over = "side";
  expandHeight = "42px";
  collapseHeight = "42px";
  displayMode = "flat";
  // overlap = false;
  activeMediaQuery = "";
  watcher: Subscription;
  currentUrl: string = "";
  searchKey: string = null;

  currentUser: User = null;
  hideGuestAccountInfoBox: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private angulartics: Angulartics2GoogleGlobalSiteTag,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private notificationService: NotificationService,
    private titleService: Title,
    private router: Router,
    private media: ObservableMedia) {
    angulartics.startTracking();
    this.currentUser = this.authService.currentUser;
    this.watcher = media.subscribe((change: MediaChange) => {
      this.currentUrl = this.router.url;
      this.activeMediaQuery = change.mqAlias;
      if (change.mqAlias === "sm" || change.mqAlias === "xs") {
        this.opened = false;
        this.over = "side";
      } else {
        if (this.currentUrl === "/") {
          this.opened = true;
          this.over = "side";
        } else {
          this.opened = true;
          this.over = "side";
        }
      }
    });
  }

  pathChecker(): void {
    this.currentUrl = this.router.url;
    if (this.currentUrl === "/") {
      this.opened = true;
      this.over = "side";
    } else {
      if (this.activeMediaQuery === "sm" || this.activeMediaQuery === "xs") {
        this.opened = false;
        this.over = "side";
      } else {
        this.opened = true;
        this.over = "side";
      }
    }
  }

  isLandingPage(): boolean {
    return this.currentUrl === "/"
      ? !this.currentUser.isAuthenticated()
      : false;
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

  search() {
    this.router.navigate(["app/search", { searchKey: this.searchKey }]);
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
        this.pathChecker(); // for home and mobile
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === "primary"),
      mergeMap(route => route.data))
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
