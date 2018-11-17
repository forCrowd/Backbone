import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./main/app.module";
//import { AppModule } from "./dev-all/app.module";
//import { AppModule } from "./dev-basic/app.module";

import { environment } from "./environments/environment";

if (environment.name !== "Development") {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
