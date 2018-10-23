import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "ngx-moment";

import { MaterialModule } from "./material.module";

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MomentModule
  ]
})
export class SharedModule { }
