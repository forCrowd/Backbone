import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { BreezeBridgeAngularModule } from "../../libraries/breeze-bridge-angular";
import "./rxjs-extensions";

// Internal modules
import { AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { ContributorsComponent } from "./components/contributors.component";
import { CoreComponent } from "./components/core.component";
import { HomeComponent } from "./components/home.component";
import { NotFoundComponent } from "./components/not-found.component";
import { SearchComponent } from "./components/search.component";
import { ShowcaseComponent } from "./components/showcase.component";

// Services
import { AppEntityManager } from "./app-entity-manager.service";
import { AppErrorHandler } from "./app-error-handler.service";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./auth.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { NotificationService } from "./notification.service";
import { ProjectService } from "./project.service";

export { Angulartics2GoogleAnalytics, ProjectService }

const coreRoutes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/search", component: SearchComponent, data: { title: "Search" } },
    { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" },
];

export function appInitializer(authService: AuthService, googleAnalyticsService: GoogleAnalyticsService) {

    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    // https://github.com/angular/angular/issues/9047

    return () => {
        googleAnalyticsService.configureTrackingCode(); // Setup google analytics

        return authService.init().toPromise();
    };
}

@NgModule({
    declarations: [
        ContributorsComponent,
        CoreComponent,
        HomeComponent,
        NotFoundComponent,
        SearchComponent,
        ShowcaseComponent
    ],
    exports: [
        RouterModule,
        CoreComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppHttpClientModule,
        RouterModule.forRoot(coreRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        BreezeBridgeAngularModule
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInitializer,
            "deps": [AuthService, GoogleAnalyticsService],
            "multi": true,
        },
        // Error handler
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler
        },
        AppEntityManager,
        AuthGuard,
        AuthService,
        CanDeactivateGuard,
        DynamicTitleResolve,
        NotificationService,
        GoogleAnalyticsService,
        ProjectService
    ]
})
export class CoreModule { }
