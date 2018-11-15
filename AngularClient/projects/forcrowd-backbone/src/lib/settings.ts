// @dynamic
// Fixes "Error encountered in metadata generated for exported symbol" error during 'build' operation
// More info: https://github.com/angular/angular/issues/18867
export class Settings {

  static get analyticsDomainName() {
    return this._analyticsDomainName;
  }

  static get analyticsTrackingCode() {
    return this._analyticsTrackingCode;
  }

  static get serviceApiUrl() {
    return this._serviceApiUrl;
  }

  static get serviceODataUrl() {
    return this._serviceODataUrl;
  }

  private static _analyticsDomainName = "";
  private static _analyticsTrackingCode = "";
  private static _serviceApiUrl = "";
  private static _serviceODataUrl = "";

  static init(analyticsDomainName: string, analyticsTrackingCode: string, serviceApiUrl: string, serviceODataUrl: string) {
    this._analyticsDomainName = analyticsDomainName;
    this._analyticsTrackingCode = analyticsTrackingCode;
    this._serviceApiUrl = serviceApiUrl;
    this._serviceODataUrl = serviceODataUrl;
  }
}
