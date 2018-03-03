import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

// Components
import { AdminOverviewComponent } from "./admin-overview.component";
import { ProjectsComponent } from "./projects.component";

// Services
import { AdminGuard } from "./admin-guard.service";
import { AdminService } from "./admin.service";

// Routes
const adminRoutes: Routes = [
    { path: "app/admin", component: AdminOverviewComponent, canActivate: [AdminGuard], data: { title: "Admin Overview" } },
    { path: "app/admin/projects", component: ProjectsComponent, canActivate: [AdminGuard], data: { title: "Projects" } }
];

@NgModule({
    declarations: [
        AdminOverviewComponent,
        ProjectsComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(adminRoutes),
    ],
    providers: [
        AdminGuard,
        AdminService
    ]
})
export class AdminModule { }
