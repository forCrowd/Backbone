import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "ngx-moment";

import { MaterialModule } from "./material.module";

@NgModule({
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    MomentModule
  ]
})
export class SharedModule { }
