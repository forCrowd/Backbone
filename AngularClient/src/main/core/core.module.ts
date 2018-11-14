import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2Module } from "angulartics2";
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { ForcrowdBackboneModule, AuthService, GoogleAnalyticsService } from "forcrowd-backbone";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../shared/shared.module";

// Components
import { ContributorsComponent } from "./components/contributors.component";
import { CoreComponent } from "./components/core.component";
import { GettingStartedComponent } from "./components/getting-started.component";
import { HomeComponent } from "./components/home.component";
import { NotFoundComponent } from "./components/not-found.component";
import { SearchComponent } from "./components/search.component";

// Services
import { AuthGuard } from "./auth-guard.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { ProjectService } from "./project.service";

export { AuthGuard, CanDeactivateGuard, DynamicTitleResolve, ProjectService }

const coreRoutes: Routes = [
  { path: "", component: HomeComponent, data: { title: "Home" } },
  { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
  { path: "app/getting-started", component: GettingStartedComponent, data: { title: "Getting Started" } },
  { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },
  { path: "app/search", component: SearchComponent, data: { title: "Search" } },

  /* Home alternatives */
  { path: "app/home", redirectTo: "", pathMatch: "full" },
  { path: "app.html", redirectTo: "", pathMatch: "full" },
  { path: "app-aot.html", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  declarations: [
    ContributorsComponent,
    CoreComponent,
    GettingStartedComponent,
    HomeComponent,
    NotFoundComponent,
    SearchComponent,
  ],
  exports: [
    RouterModule,
    CoreComponent,
    FlexLayoutModule
  ],
  imports: [
    FlexLayoutModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(coreRoutes),
    Angulartics2Module.forRoot(),
    ForcrowdBackboneModule,
  ],
  providers: [
    AuthService,
    GoogleAnalyticsService,
    AuthGuard,
    CanDeactivateGuard,
    DynamicTitleResolve,
    ProjectService,
    FlexLayoutModule,
  ]
})
export class CoreModule { }
