import { Component, NgModule } from "@angular/core";

import { AccountModule } from "./account/account.module";
import { AdminModule } from "./admin/admin.module";
import { AppCoreModule } from "./core/app-core.module";
import { NotFoundModule } from "./not-found/not-found.module";
import { ProjectModule } from "./project/project.module";

// App component
@Component({
  selector: "app",
  template: "<core></core>"
})
export class AppComponent { }

// App module
@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    AppCoreModule,
    AccountModule,
    ProjectModule,
    AdminModule,
    NotFoundModule // Catch-all route
  ]
})
export class AppModule { }
