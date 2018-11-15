import { Injectable } from "@angular/core";

export class SettingsService2 {

  //private static _setting1 = "";

  //static get environment(): string { return "xxxxxx"; }

  //static get setting1(): string {
  //  return "xxx";
  //}
  //private static set setting1(value) {
  //  this._setting1 = value;
  //}

  //static init2(setting1: string) {
  //  console.log("s1", setting1);
  //  this._setting1 = setting1;
  //  //SettingsService._setting1 = setting1;
  //}
}

@Injectable()
export class SettingsService {

  // private static _setting1 = "";

  //static get setting1() {
  //  return this._setting1;
  //}
  //private static set setting1(value) {
  //  this._setting1 = value;
  //}

  //static init2(setting1: string) {
  //  console.log("s1", setting1);
  //  this._setting1 = setting1;
  //  //SettingsService._setting1 = setting1;
  //}

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
    var url = `${this.serviceAppUrl}/odata/v1`;
    console.log("u", url);
    return url;
  }

}
