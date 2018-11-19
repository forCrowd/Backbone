import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed, getTestBed } from "@angular/core/testing";

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

    var errorHandler = new AppErrorHandler(null, { serviceApiUrl: "", serviceODataUrl: "" });
    expect(errorHandler).toBeDefined();

  });

  it("handleError", () => {

    var errorHandler = new AppErrorHandler(httpClient, { serviceApiUrl: "", serviceODataUrl: "" });
    var error = new Error("error");
    errorHandler.handleError(error);

    expect(true).toBe(true);

  });

});
