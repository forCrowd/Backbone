import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "forcrowd-backbone";

import { AuthGuard, CanDeactivateGuard, DynamicTitleResolve } from "../core/core.module";
import { ElementManagerComponent } from "./element-manager.component";
import { ElementCellManagerComponent } from "./element-cell-manager.component";
import { ElementFieldManagerComponent } from "./element-field-manager.component";
import { ElementItemManagerComponent } from "./element-item-manager.component";
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
    ElementCellManagerComponent,
    ElementFieldManagerComponent,
    ElementItemManagerComponent,
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
