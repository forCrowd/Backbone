import { IEntityManagerConfig, EntityManagerConfig } from "./app-entity-manager/app-entity-manager-config";

export interface ICoreConfig {
  environment: string;
  serviceApiUrl: string;
  serviceODataUrl: string;
  entityManagerConfig?: IEntityManagerConfig;
  sourceMapMappingsUrl?: string;
}

export class CoreConfig implements ICoreConfig {

  environment = "";
  serviceApiUrl = "";
  serviceODataUrl = "";
  entityManagerConfig = new EntityManagerConfig();
  sourceMapMappingsUrl = "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm";

  constructor(config: ICoreConfig) {

    if (!(config.environment && config.serviceApiUrl && config.serviceODataUrl)) {
      throw new Error("Invalid configuration: 'environment', 'serviceApiUrl' and 'serviceODataUrl' settings must be set");
    }

    this.environment = config.environment;
    this.serviceApiUrl = config.serviceApiUrl;
    this.serviceODataUrl = config.serviceODataUrl;

    if (config.entityManagerConfig)
      this.entityManagerConfig = new EntityManagerConfig(config.entityManagerConfig);

    if (config.sourceMapMappingsUrl)
      this.sourceMapMappingsUrl = config.sourceMapMappingsUrl;
  }
}
