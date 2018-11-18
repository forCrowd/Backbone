import { HttpClient } from "@angular/common/http";

import { AppErrorHandler } from "./app-error-handler";

class MockHttpClient extends HttpClient {

}

describe("app-error-handler", () => {

  it("sanity", () => {
    expect(true).toBe(true);
  });

  it("constructor", () => {

    var errorHandler = new AppErrorHandler(null, { serviceApiUrl: "", serviceODataUrl: "" });
    expect(errorHandler).toBeDefined();

  });

  it("handleError", () => {

    var httpClient = new MockHttpClient(null);

    var errorHandler = new AppErrorHandler(httpClient, { serviceApiUrl: "", serviceODataUrl: "" });
    var error = new Error("error");
    errorHandler.handleError(error);

  });

});
