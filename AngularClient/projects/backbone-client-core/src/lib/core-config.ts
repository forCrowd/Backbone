import { EntityManagerConfig } from "./app-entity-manager/app-entity-manager-config";

export class CoreConfig {

  constructor(public environment: string,
    public serviceApiUrl: string,
    public serviceODataUrl: string,
    public entityManagerConfig?: EntityManagerConfig,
    public sourceMapMappingsUrl?: string) {

    if (!(environment && serviceApiUrl && serviceODataUrl)) {
      throw new Error("Invalid argument");
    }

    if (!entityManagerConfig) {
      this.entityManagerConfig = new EntityManagerConfig();
    }

    if (!sourceMapMappingsUrl) {
      this.sourceMapMappingsUrl = "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm";
    }
  }
}
