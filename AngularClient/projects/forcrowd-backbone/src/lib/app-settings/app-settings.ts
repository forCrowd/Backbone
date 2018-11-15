import { Injectable } from "@angular/core";
import { environment } from "./environments/environment-settings";

@Injectable()
// @dynamic
export class AppSettings {

  // static get x() { return "x"; }

  /*
   * Google Analytics domain name
   * Leave blank to disable analytics
   */
  get analyticsDomainName(): string { return environment.analyticsDomainName; }

  /*
   * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
   * Leave blank to disable analytics
   */
  get analyticsTrackingCode(): string { return environment.analyticsTrackingCode; }

  /*
   * Service application API url
   */
  get serviceApiUrl(): string { return `${environment.serviceAppUrl}/api/v1` };

  /*
   * Service application OData url
   */
  get serviceODataUrl(): string { return `${environment.serviceAppUrl}/odata/v1`; }

}
