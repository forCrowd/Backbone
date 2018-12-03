import { ErrorHandler, ModuleWithProviders, NgModule } from "@angular/core";

import { AppEntityManagerModule } from "./app-entity-manager/app-entity-manager-module";
import { AppHttpClientModule } from "./app-http-client/app-http-client-module";
import { AuthModule } from "./auth/auth-module";
import { AppErrorHandler } from "./services/app-error-handler";
import { NotificationService } from "./services/notification-service";
import { ProjectService } from "./services/project-service";
import { ICoreConfig, CoreConfig } from "./core-config";

export function coreConfigFactory(config: ICoreConfig) {
  return new CoreConfig(config);
}

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
export class CoreModule {

  static configure(config: ICoreConfig): ModuleWithProviders {

    return {
      ngModule: CoreModule,
      providers: [
        // coreConfigFactory converts the initial config object to CoreConfig instance, which does validation and uses the default values
        // "CoreConfigInitial" provider is only there, so it can be passed to the factory
        // Bit hacky but Angular compiler won't allow arrow functions here for now / coni2k - 03 Dec. '18
        {
          provide: "CoreConfigInitial",
          useValue: config
        },
        {
          deps: ["CoreConfigInitial"],
          provide: CoreConfig,
          useFactory: coreConfigFactory
        },
        // Error handler
        {
          provide: ErrorHandler,
          useClass: AppErrorHandler
        },
        NotificationService,
        ProjectService
      ]
    };
  }
}
