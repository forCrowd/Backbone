import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";

// Settings
import { Settings } from "./settings";

// Services
import { AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { AppErrorHandler } from "./app-error-handler.service";
import { AuthService } from "./auth.service";
import { AppEntityManager } from "./app-entity-manager.service";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { NotificationService } from "./notification.service";

// Breeze
import "./breeze-client-odata-fix";
import { BreezeBridgeHttpClientModule } from "breeze-bridge2-angular";

// Todo!
export { AuthService, AppEntityManager, NotificationService, GoogleAnalyticsService }

export function appInitializer(authService: AuthService, googleAnalyticsService: GoogleAnalyticsService) {

  // Do initing of services that is required before app loads
  // NOTE: this factory needs to return a function (that then returns a promise)
  // https://github.com/angular/angular/issues/9047

  return () => {
    googleAnalyticsService.configureTrackingCode(); // Setup google analytics
    return authService.init().toPromise();
  }
}

// @dynamic
@NgModule({
  imports: [
    AppHttpClientModule,
    BreezeBridgeHttpClientModule,
  ],
  providers: [
    // Application initializer
    {
      deps: [AuthService, GoogleAnalyticsService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer
    },
    // Error handler
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    AppEntityManager,
    AuthService,
    GoogleAnalyticsService,
    NotificationService,
  ]
})
export class ForcrowdBackboneModule {
  static init(analyticsDomainName: string, analyticsTrackingCode: string, serviceApiUrl: string, serviceODataUrl: string) {
    Settings.init(analyticsDomainName, analyticsTrackingCode, serviceApiUrl, serviceODataUrl);
    return this;
  }
}
