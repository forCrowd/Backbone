import { environment } from "./environments/environment-settings";

export class AppSettings {

  /*
   * Name of the current environment
   */
  static get environment(): string { return environment.name; }

  /*
   * Service application API url
   */
  static get serviceApiUrl(): string { return environment.serviceApiUrl; }

  /*
   * Service application OData url
   */
  static get serviceODataUrl(): string { return environment.serviceODataUrl; }

  /*
   * Origin field for the example project that 'Getting started' page creates
   */
  static get todoAppOrigin(): string { return environment.todoAppOrigin; }

  /*
   * Application version number
   */
  static get version(): string { return "0.9.5"; }
}
