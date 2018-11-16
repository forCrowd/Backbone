import { Injectable } from "@angular/core";

import { Settings } from "./settings";

@Injectable()
export class GoogleAnalyticsService {

  constructor(private readonly settings: Settings) { }

  configureTrackingCode() {

    if (this.settings.analyticsTrackingCode === "" || this.settings.analyticsDomainName === "") {
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

    this.ga("create", this.settings.analyticsTrackingCode, this.settings.analyticsDomainName);
  }

  private ga(...args: string[]): void {
    (window["ga"].q = window["ga"].q || []).push(args);
  }
}
