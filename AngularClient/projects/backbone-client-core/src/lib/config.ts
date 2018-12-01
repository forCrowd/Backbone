import { EntityManagerConfig } from "./app-entity-manager/app-entity-manager-config"

export class Config {
  environment = "";
  entityManagerConfig = new EntityManagerConfig();
  serviceApiUrl = "";
  serviceODataUrl = "";
  sourceMapMappingsUrl = "";
}
