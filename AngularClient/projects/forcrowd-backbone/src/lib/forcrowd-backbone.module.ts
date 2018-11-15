import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { AppErrorHandler } from "./app-error-handler.service";

// Services
import { AuthService } from "./auth.service";
import { AppEntityManager } from "./app-entity-manager.service";
import { NotificationService } from "./notification.service";
import { GoogleAnalyticsService } from "./google-analytics.service";

// Breeze
import "./breeze-client-odata-fix";
import { BreezeBridgeHttpClientModule } from "breeze-bridge2-angular";
import { ForcrowdBackboneComponent } from "./forcrowd-backbone.component";
import { AppSettings } from "./app-settings/app-settings";
import { SettingsService } from "./settings.service";

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
  declarations:[
    ForcrowdBackboneComponent
  ],
  exports: [
    ForcrowdBackboneComponent
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
    AppSettings,
    AppEntityManager,
    AuthService,
    GoogleAnalyticsService,
    NotificationService,
    SettingsService,
  ]
})
export class ForcrowdBackboneModule { }
