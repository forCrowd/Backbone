import { APP_INITIALIZER, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2Module } from "angulartics2";
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";

// Components
import { MiscComponent } from "./misc.component";
import { ODataComponent } from "./odata.component";
import { ProjectTesterComponent } from "./project-tester.component";
import { WebApiComponent } from "./web-api.component";

import { GoogleAnalyticsService } from "../main/core/google-analytics.service";

export { Angulartics2GoogleAnalytics, GoogleAnalyticsService }

const routes: Routes = [
  { path: "", component: MiscComponent, data: { title: "Misc" } },
  { path: "app/odata", component: ODataComponent, data: { title: "OData" } },
  { path: "app/project-tester", component: ProjectTesterComponent, data: { title: "Project Tester" } },
  { path: "app/web-api", component: WebApiComponent, data: { title: "WebApi" } },

  /* Home alternatives */
  { path: "app/misc", redirectTo: "", pathMatch: "full" },
  { path: "app.html", redirectTo: "", pathMatch: "full" },
  { path: "app-aot.html", redirectTo: "", pathMatch: "full" }
];

export function appInitializer(googleAnalyticsService: GoogleAnalyticsService) {
  return () => {
    googleAnalyticsService.configureTrackingCode();
  };
}

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
    Angulartics2Module.forRoot()
  ],
  providers: [
    // Application initializer
    {
      deps: [GoogleAnalyticsService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
    },
    GoogleAnalyticsService
  ]
})
export class AppRouterModule { }
