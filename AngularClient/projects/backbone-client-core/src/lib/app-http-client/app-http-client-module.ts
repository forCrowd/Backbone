import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";

import { AppHttpClient } from "./app-http-client";
import { AuthInterceptor } from "./auth-interceptor";
import { BusyInterceptor } from "./busy-interceptor";
import { ErrorInterceptor } from "./error-interceptor";

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: HttpClient,
      useClass: AppHttpClient,
    },
    // Auth Interceptor
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
    },
    // Busy Interceptor
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: BusyInterceptor,
    },
    // Error Interceptor
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
    },
  ]
})
export class AppHttpClientModule { }
