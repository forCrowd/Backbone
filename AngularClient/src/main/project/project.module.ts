import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { AuthGuard } from "../core/auth-guard.service";
import { DynamicTitleResolve } from "../core/dynamic-title-resolve.service";
import { CanDeactivateGuard } from "../core/can-deactivate-guard.service";
import { ElementManagerComponent } from "./element-manager.component";
import { ProjectManagerComponent } from "./project-manager.component";
import { ProjectViewerComponent } from "./project-viewer.component";
import { SymbolicPipe } from "./symbolic.pipe";

const projectRoutes: Routes = [
    { path: "projects/new", component: ProjectManagerComponent, canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: "projects/:project-id/edit", component: ProjectManagerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: "projects/:project-id", component: ProjectViewerComponent, resolve: { title: DynamicTitleResolve } },
];

@NgModule({
    declarations: [
        ElementManagerComponent,
        ProjectManagerComponent,
        ProjectViewerComponent,
        SymbolicPipe
    ],
    exports: [
        RouterModule,

        SymbolicPipe
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(projectRoutes),
    ]
})
export class ProjectModule { }
