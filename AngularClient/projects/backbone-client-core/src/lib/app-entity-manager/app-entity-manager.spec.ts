import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed, getTestBed } from "@angular/core/testing";

import "./breeze-client-odata-fix";
import { BreezeBridgeHttpClientModule } from "breeze-bridge2-angular";

import { AppEntityManager } from "./app-entity-manager";
import { EntityManagerConfig } from "./app-entity-manager-config";
import { metadataExported } from "./metadata";
import { Project } from "../entities/project";
import { NotificationService } from "../services/notification-service";
import { Config } from "../config";

class CustomProject extends Project {
  get IdExtended() {
    return this.Id + "-extended";
  }
}

describe("app-entity-manager/app-entity-manager", () => {

  let breezeBridgeHttpClientModule: BreezeBridgeHttpClientModule;
  const entityManagerConfig = new EntityManagerConfig();
  let injector: TestBed;
  const notificationService = new NotificationService();
  let config: Config;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BreezeBridgeHttpClientModule,
        HttpClientModule
      ],
      providers: [HttpClient]
    });

    injector = getTestBed();
    breezeBridgeHttpClientModule = injector.get(BreezeBridgeHttpClientModule);
    entityManagerConfig.projectType = CustomProject;

    config = {
      environment: "",
      entityManagerConfig: entityManagerConfig,
      serviceApiUrl: "",
      serviceODataUrl: "",
      sourceMapMappingsUrl: ""
    };
  });

  it("should be defined", () => {
    const manager = new AppEntityManager(breezeBridgeHttpClientModule, notificationService, config);
    expect(manager).toBeDefined();
  });

  it("custom project type", () => {

    const manager = new AppEntityManager(breezeBridgeHttpClientModule, notificationService, config);

    manager.metadataStore.importMetadata(metadataExported);

    var project = manager.createEntity("Project", { Id: 0 }) as CustomProject;

    expect(project).toBeDefined();
    expect(project.$typeName).toBe("Project");
    expect(project instanceof CustomProject).toBeTruthy();

  });

});
