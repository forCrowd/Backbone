import { Injectable } from "@angular/core";

@Injectable()
export class SettingsService {

  init(analyticsDomainName: string, analyticsTrackingCode: string, serviceAppUrl: string) {
    this.analyticsDomainName = analyticsDomainName;
    this.analyticsTrackingCode = analyticsTrackingCode;
    this.serviceAppUrl = serviceAppUrl;

    console.log("t", this);
  }

  /*
   * Google Analytics domain name
   * Leave blank to disable analytics
   */
  analyticsDomainName = "";

  /*
   * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
   * Leave blank to disable analytics
   */
  analyticsTrackingCode = "";

  /*
   * Service application (WebApi) url
   */
  serviceAppUrl = "";

  /*
   * Service application API url
   */
  getServiceApiUrl() {
    return `${this.serviceAppUrl}/api/v1`
  };

  /*
   * Service application OData url
   */
  getServiceODataUrl() {
    return `${this.serviceAppUrl}/odata/v1`;
  }

}
