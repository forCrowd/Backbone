export interface ISettings {
  analyticsDomainName: string;
  analyticsTrackingCode: string;
  serviceApiUrl: string;
  serviceODataUrl: string;
}

export class Settings implements ISettings {
  analyticsDomainName = "";
  analyticsTrackingCode = "";
  serviceApiUrl = "";
  serviceODataUrl = "";
}
