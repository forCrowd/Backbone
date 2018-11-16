import { Injectable } from "@angular/core";

import { environment } from "../../app-settings/environments/environment-settings";

@Injectable()
export class GoogleAnalyticsService {

  configureTrackingCode() {

    console.log("analytics", environment.analyticsTrackingCode, environment.analyticsDomainName);

    if (environment.analyticsTrackingCode === "" || environment.analyticsDomainName === "") {
      return;
    }

    console.log("analytics - configuring..");

    window["GoogleAnalyticsObject"] = "ga";
    window["ga"] = window["ga"] || this.ga;
    window["ga"].l = new Date().getTime();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.google-analytics.com/analytics.js";

    const firstElement = document.getElementsByTagName("script")[0];
    firstElement.parentNode.insertBefore(script, firstElement);

    this.ga("create", environment.analyticsTrackingCode, environment.analyticsDomainName);
  }

  private ga(...args: string[]): void {
    console.log("z arg", ...args);
    (window["ga"].q = window["ga"].q || []).push(args);
  }
}
