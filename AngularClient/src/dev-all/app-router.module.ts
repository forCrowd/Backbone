import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { MiscComponent } from "./misc.component";
import { ODataComponent } from "./odata.component";
import { ProjectTesterComponent } from "./project-tester.component";
import { WebApiComponent } from "./web-api.component";

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

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
  ]
})
export class AppRouterModule { }
