import { Injectable } from "@angular/core";

import { AppSettings } from "./app-settings/app-settings";

@Injectable()
export class GoogleAnalyticsService {

  constructor(private appSettings: AppSettings) { }

  configureTrackingCode() {

    if (this.appSettings.analyticsTrackingCode === "" || this.appSettings.analyticsDomainName === "") {
      return;
    }

    window["GoogleAnalyticsObject"] = "ga";
    window["ga"] = window["ga"] || this.ga;
    window["ga"].l = new Date().getTime();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.google-analytics.com/analytics.js";

    const firstElement = document.getElementsByTagName("script")[0];
    firstElement.parentNode.insertBefore(script, firstElement);

    this.ga("create", this.appSettings.analyticsTrackingCode, this.appSettings.analyticsDomainName);
  }

  private ga(...args: string[]): void {
    (window["ga"].q = window["ga"].q || []).push(args);
  }
}
