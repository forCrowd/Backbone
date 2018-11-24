import { ErrorHandler, ModuleWithProviders, NgModule } from "@angular/core";

import { AppEntityManagerModule } from "./app-entity-manager/app-entity-manager-module";
import { AppHttpClientModule } from "./app-http-client/app-http-client-module";
import { AuthModule } from "./auth/auth-module";
import { AppErrorHandler } from "./services/app-error-handler";
import { NotificationService } from "./services/notification-service";
import { ProjectService } from "./services/project-service";
import { ISettings, Settings } from "./settings";

// @dynamic
// Fixes "Error encountered in metadata generated for exported symbol" error during 'build' operation
// More info: https://github.com/angular/angular/issues/18867
@NgModule({
  imports: [
    AppEntityManagerModule,
    AppHttpClientModule,
    AuthModule.init()
  ]
})
export class MainModule {

  static configure(settings: ISettings): ModuleWithProviders {

    return {
      ngModule: MainModule,
      providers: [
        // Error handler
        {
          provide: ErrorHandler,
          useClass: AppErrorHandler
        },
        NotificationService,
        ProjectService,
        // Settings
        {
          provide: Settings,
          useValue: settings
        }
      ]
    };
  }
}
