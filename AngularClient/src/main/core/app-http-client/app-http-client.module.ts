import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

// Interceptors
import { AuthInterceptor } from "./auth-interceptor";
import { BusyInterceptor } from "./busy-interceptor";
import { ErrorInterceptor } from "./error-interceptor";

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        // Auth Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        // Busy Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BusyInterceptor,
            multi: true
        },
        // Error Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class AppHttpClientModule { }
