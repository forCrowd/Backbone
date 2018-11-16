export interface ISettings {
  serviceApiUrl: string;
  serviceODataUrl: string;
}

export class Settings implements ISettings {
  serviceApiUrl = "";
  serviceODataUrl = "";
}
