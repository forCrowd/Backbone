import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "angular2-moment";

import { NgChartModule } from "./ng-chart/ng-chart.module";
import { MaterialModule } from "./material.module";

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        MomentModule,
        NgChartModule
    ]
})
export class SharedModule { }
