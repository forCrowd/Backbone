import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";

import { AuthService } from "./auth-service";

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
@NgModule()
export class AuthModule {
  static init(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        // Application initializer
        {
          deps: [AuthService],
          multi: true,
          provide: APP_INITIALIZER,
          useFactory: appInitializer
        },
        AuthService
      ]
    }
  }
}
