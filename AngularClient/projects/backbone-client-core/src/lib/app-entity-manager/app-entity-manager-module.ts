import { NgModule } from "@angular/core";

import "./breeze-client-odata-fix";
import { BreezeBridgeHttpClientModule } from "breeze-bridge2-angular";

import { AppEntityManager } from "./app-entity-manager";

@NgModule({
  imports: [
    BreezeBridgeHttpClientModule,
  ],
  providers: [
    AppEntityManager
  ]
})
export class AppEntityManagerModule { }
