import { Component, NgModule } from "@angular/core";

import { CoreModule } from "./core/core.module";
import { AccountModule } from "./account/account.module";
import { AdminModule } from "./admin/admin.module";
import { ProjectModule } from "./project/project.module";
import { UserModule } from "./user/user.module";

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
        CoreModule,
        AccountModule,
        AdminModule,
        ProjectModule, // Register Project & User modules as the last ones, because of "catch all" routes
        UserModule
    ]
})
export class AppModule { }
