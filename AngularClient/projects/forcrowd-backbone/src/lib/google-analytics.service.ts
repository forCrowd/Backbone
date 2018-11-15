import { Injectable } from "@angular/core";

import { Settings } from "./settings";

@Injectable()
export class GoogleAnalyticsService {

  configureTrackingCode() {

    if (Settings.analyticsTrackingCode === "" || Settings.analyticsDomainName === "") {
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

    this.ga("create", Settings.analyticsTrackingCode, Settings.analyticsDomainName);
  }

  private ga(...args: string[]): void {
    (window["ga"].q = window["ga"].q || []).push(args);
  }
}
