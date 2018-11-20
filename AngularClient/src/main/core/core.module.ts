import { Component, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2Module } from "angulartics2";
import { BackboneClientCoreModule, ISettings } from "backbone-client-core";

import { SharedModule } from "../shared/shared.module";

import { settings } from "../../settings/settings";

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
import { LandingPageComponent } from "./components/landing-page.component";
import { UserModule } from "../user/user.module";

export { AuthGuard, CanDeactivateGuard, DynamicTitleResolve, ProjectService }

// TODO: Remove! Only here to test appErrorHandler on production
@Component({
  template: ``
})
export class ExComponent {
  constructor() { throw new Error("test"); }
}

const coreRoutes: Routes = [
  { path: "", component: LandingPageComponent, data: { title: "Home" } },
  { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
  { path: "app/getting-started", component: GettingStartedComponent, data: { title: "Getting Started" } },
  { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },
  { path: "app/search", component: SearchComponent, data: { title: "Search" } },
  { path: "app/ex", component: ExComponent },

  /* Home alternatives */
  { path: "app/home", redirectTo: "", pathMatch: "full" },
  { path: "app.html", redirectTo: "", pathMatch: "full" },
  { path: "app-aot.html", redirectTo: "", pathMatch: "full" },
];

const coreSettings: ISettings = {
  environment: settings.environment,
  serviceApiUrl: settings.serviceApiUrl,
  serviceODataUrl: settings.serviceODataUrl,
  sourceMapMappingsUrl: settings.sourceMapMappingsUrl
}

@NgModule({
  declarations: [
    ContributorsComponent,
    CoreComponent,
    ExComponent,
    GettingStartedComponent,
    HomeComponent,
    LandingPageComponent,
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
    UserModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(coreRoutes),
    Angulartics2Module.forRoot(),
    BackboneClientCoreModule.configure(coreSettings)
  ],
  providers: [
    AuthGuard,
    CanDeactivateGuard,
    DynamicTitleResolve,
    ProjectService,
    FlexLayoutModule,
  ]
})
export class CoreModule { }
