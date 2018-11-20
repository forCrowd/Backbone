import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./main/app.module";
//import { AppModule } from "./dev-all/app.module";
//import { AppModule } from "./dev-basic/app.module";

import { settings } from "./settings/settings";

if (settings.environment !== "Development") {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
