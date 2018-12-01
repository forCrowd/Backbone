import { EntityManagerConfig } from "./app-entity-manager/app-entity-manager-config";
import { CoreConfig } from "./core-config";

describe("core-config", () => {

  it("should be defined - default constructor", () => {

    const config = new CoreConfig("a", "b", "c");
    console.log("c1", config);
    expect(config).toBeDefined();
    expect(config.sourceMapMappingsUrl).toBe("https://unpkg.com/source-map@0.7.3/lib/mappings.wasm");

  });

  it("should be defined - custom constructor", () => {

    var config = new CoreConfig("a", "b", "c", new EntityManagerConfig(), "");
    console.log("c2", config);
    expect(config).toBeDefined();

  });

  it("should be defined - custom constructor 2", () => {

    var config = new CoreConfig("a", "b", "c", new EntityManagerConfig({}), "");
    console.log("c3", config);
    expect(config).toBeDefined();

  });

});
