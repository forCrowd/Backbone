import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed, getTestBed } from "@angular/core/testing";
import { from } from "rxjs";
import { SourceMapConsumer } from "source-map";

import { CoreConfig } from "../core-config";
import { AppErrorHandler } from "./app-error-handler";

describe("app-error-handler", () => {

  let injector: TestBed;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
    injector = getTestBed();
    httpClient = injector.get(HttpClient);
  });

  it("sanity", () => {
    expect(true).toBe(true);
  });

  it("constructor", () => {

    var config: CoreConfig = {
      environment: "Development",
      entityManagerConfig: null,
      serviceApiUrl: "",
      serviceODataUrl: "",
      sourceMapMappingsUrl: "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
    };

    var errorHandler = new AppErrorHandler(null, config);
    expect(errorHandler).toBeDefined();

  });

  it("sourceMapConsumer sanity tests", () => {

    // https://www.npmjs.com/package/source-map/v/0.7.3

    const rawSourceMap = {
      version: 3,
      file: "min.js",
      names: ["bar", "baz", "n"],
      sources: ["one.js", "two.js"],
      sourceRoot: "http://example.com/www/js/",
      mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA"
    };

    (SourceMapConsumer as any).initialize({ "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm" });

    from(SourceMapConsumer.with(rawSourceMap, null, consumer => {

      console.log(consumer.sources);
      // [ 'http://example.com/www/js/one.js',
      //   'http://example.com/www/js/two.js' ]

      // consumer.originalPositionFor({})

      console.log(consumer.originalPositionFor({
        line: 2,
        column: 28,
        bias: null,
      }));
      // { source: 'http://example.com/www/js/two.js',
      //   line: 2,
      //   column: 10,
      //   name: 'n' }

      console.log(consumer.generatedPositionFor({
        source: "http://example.com/www/js/two.js",
        line: 2,
        column: 10,
        bias: null
      }));
      // { line: 2, column: 28 }

      consumer.eachMapping(m => {
        // ...
      });

    })).subscribe();

    expect(true).toBeTruthy();

  });

});
