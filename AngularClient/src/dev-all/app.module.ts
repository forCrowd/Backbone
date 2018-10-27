import { NgModule } from "@angular/core";

import { AdminModule } from "../main/admin/admin.module";
import { CoreModule } from "../main/core/core.module";
import { ForcrowdBackboneModule, SharedModule } from "forcrowd-backbone";

import { AppRouterModule } from "./app-router.module";
import { AppComponent } from "./app.component";
import { MiscComponent } from "./misc.component";
import { NavigationComponent } from "./navigation.component";
import { ODataComponent } from "./odata.component";
import { ODataElementComponent } from "./odata-element.component";
import { ODataElementCellComponent } from "./odata-element-cell.component";
import { ODataElementFieldComponent } from "./odata-element-field.component";
import { ODataElementItemComponent } from "./odata-element-item.component";
import { ODataProjectComponent } from "./odata-project.component";
import { ODataUserElementCellComponent } from "./odata-user-element-cell.component";
import { ODataUserElementFieldComponent } from "./odata-user-element-field.component";
import { ODataUserComponent } from "./odata-user.component";
import { ProjectTesterComponent } from "./project-tester.component";
import { WebApiComponent } from "./web-api.component";

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    MiscComponent,
    NavigationComponent,
    ODataComponent,
    ODataElementComponent,
    ODataElementCellComponent,
    ODataElementFieldComponent,
    ODataElementItemComponent,
    ODataProjectComponent,
    ODataUserElementCellComponent,
    ODataUserElementFieldComponent,
    ODataUserComponent,
    ProjectTesterComponent,
    WebApiComponent
  ],
  imports: [
    SharedModule,

    AppRouterModule, // Routes (must be before Core, to set default route!)

    CoreModule,

    AdminModule,

    ForcrowdBackboneModule,
  ]
})
export class AppModule { }
