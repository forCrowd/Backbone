import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { NotFoundComponent } from "./not-found.component";

const coreRoutes: Routes = [
  { path: "app/not-found", component: NotFoundComponent, data: { title: "Not found" } },
  { path: "**", component: NotFoundComponent, data: { title: "Not found" } }
];

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    SharedModule,
    RouterModule.forRoot(coreRoutes),
  ],
})
export class NotFoundModule { }
