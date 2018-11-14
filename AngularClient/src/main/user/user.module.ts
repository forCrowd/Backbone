import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";

import { SharedModule } from "../shared/shared.module";

import { ProfileComponent } from "./profile.component";
import { ProfileRemoveProjectComponent } from "./profile-remove-project.component";
import { UserService } from "./user.service";
import { DynamicTitleResolve } from "../core/dynamic-title-resolve.service";

const userRoutes: Routes = [
  { path: "users/:username", component: ProfileComponent, resolve: { title: DynamicTitleResolve } }
];

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileRemoveProjectComponent
  ],
  entryComponents: [
    ProfileRemoveProjectComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild(userRoutes),
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
