import { Component, OnDestroy, OnInit } from "@angular/core";
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Angulartics2GoogleGlobalSiteTag } from "angulartics2/gst";
import { AuthService, NotificationService, User } from "@forcrowd/backbone-client-core";
import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

@Component({
  selector: "core",
  templateUrl: "core.component.html",
  styleUrls: ["core.component.css"]
})
export class CoreComponent implements OnDestroy, OnInit {

  activeMediaQuery = "";
  currentUser: User = null;
  hideGuestAccountInfoBox: boolean = true;
  opened = true;
  over = "side";
  searchKey: string = null;
  subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private angulartics: Angulartics2GoogleGlobalSiteTag,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private notificationService: NotificationService,
    private titleService: Title,
    private router: Router,
    private media: ObservableMedia) {
      this.angulartics.startTracking();
      this.currentUser = this.authService.currentUser;
      this.media.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change.mqAlias;
        this.pathChecker();
      });
  }

  pathChecker(): void {
    this.opened = this.router.url === "/" ? this.currentUser.isAuthenticated() : !(this.activeMediaQuery === "sm" || this.activeMediaQuery === "xs");
    if (this.activeMediaQuery === "xs") this.opened = false;
  }

  isLandingPage(): boolean {
    return this.router.url === "/" ? !this.currentUser.isAuthenticated() : false;
  }

  closeGuestAccountInfoBox(): void {
    this.hideGuestAccountInfoBox = true;
  }

  logout(): void {
    this.authService.logout();

    this.authService.init().subscribe(() => {
      this.router.navigateByUrl("/");
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

        // Login return url: If the user is not logged in and not on Login/Register pages, then set "login return url"
        if (!this.authService.currentUser.isAuthenticated()
          && this.activatedRoute.snapshot.firstChild.routeConfig.path !== "app/account/login"
          && this.activatedRoute.snapshot.firstChild.routeConfig.path !== "app/account/register") {
          this.authService.loginReturnUrl = this.router.url;
        }

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
