import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { AuthGuard, CanDeactivateGuard, DynamicTitleResolve } from "../core/app-core.module";
import { ElementManagerComponent } from "./element-manager.component";
import { ElementCellManagerComponent } from "./element-cell-manager.component";
import { ElementFieldManagerComponent } from "./element-field-manager.component";
import { ElementItemManagerComponent } from "./element-item-manager.component";
import { ProjectManagerComponent } from "./project-manager.component";
import { SymbolicPipe } from "./symbolic.pipe";
import { RemoveConfirmComponent } from "./remove-confirm.component";

const projectRoutes: Routes = [
  { path: "projects/new", component: ProjectManagerComponent, canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
  { path: "projects/:project-id/edit", component: ProjectManagerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
  { path: "projects/:project-id", component: ProjectManagerComponent, resolve: { title: DynamicTitleResolve } },
];

@NgModule({
  declarations: [
    ElementManagerComponent,
    ElementCellManagerComponent,
    ElementFieldManagerComponent,
    ElementItemManagerComponent,
    ProjectManagerComponent,
    SymbolicPipe,
    RemoveConfirmComponent
  ],
  entryComponents: [
    RemoveConfirmComponent
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
