export interface ISettings {
  environment: string;
  serviceApiUrl: string;
  serviceODataUrl: string;
  sourceMapMappingsUrl: string;
}

export class Settings implements ISettings {
  environment = "";
  serviceApiUrl = "";
  serviceODataUrl = "";
  sourceMapMappingsUrl = "";
}
