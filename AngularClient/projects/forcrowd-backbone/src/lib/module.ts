import { APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule } from "@angular/core";

// Services
import { AppEntityManagerModule } from "./app-entity-manager/app-entity-manager.module";
import { AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { AppErrorHandler } from "./services/app-error-handler";
import { AuthService } from "./services/auth.service";
import { NotificationService } from "./services/notification.service";
import { ISettings, Settings } from "./settings";

// Breeze
import "./breeze-client-odata-fix";
import { BreezeBridgeHttpClientModule } from "breeze-bridge2-angular";

export function appInitializer(authService: AuthService) {

  // Do initing of services that is required before app loads
  // NOTE: this factory needs to return a function (that then returns a promise)
  // https://github.com/angular/angular/issues/9047

  return () => {
    return authService.init().toPromise();
  }
}

// @dynamic
// Fixes "Error encountered in metadata generated for exported symbol" error during 'build' operation
// More info: https://github.com/angular/angular/issues/18867
@NgModule({
  imports: [
    AppEntityManagerModule,
    AppHttpClientModule,
    BreezeBridgeHttpClientModule,
  ]
})
export class ForcrowdBackboneModule {

  static configure(settings: ISettings): ModuleWithProviders {

    return {
      ngModule: ForcrowdBackboneModule,
      providers: [
        // Application initializer
        {
          deps: [AuthService],
          multi: true,
          provide: APP_INITIALIZER,
          useFactory: appInitializer
        },
        // Error handler
        {
          provide: ErrorHandler,
          useClass: AppErrorHandler
        },
        AuthService,
        NotificationService,
        // Settings
        {
          provide: Settings,
          useValue: settings
        }
      ]
    };
  }
}
