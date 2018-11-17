import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppHttpClient } from "backbone-client-core";

import { environment } from "../environments/environment";

@Component({
  selector: "web-api",
  templateUrl: "web-api.component.html"
})
export class WebApiComponent {

  private readonly appHttpClient: AppHttpClient = null;

  get isBusy(): boolean {
    return this.appHttpClient.isBusy;
  }

  constructor(
    private httpClient: HttpClient) {

    this.appHttpClient = httpClient as AppHttpClient;
  }

  badRequest(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/BadRequestResult", null).subscribe();
  }

  badRequestMessage(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/BadRequestMessageResult", null).subscribe();
  }

  conflict(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/ConflictResult", null).subscribe();
  }

  exception(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/ExceptionResult", null).subscribe();
  }

  internalServerError(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/InternalServerErrorResult", null).subscribe();
  }

  noContentGet(): void {
    this.httpClient.get(environment.serviceApiUrl + "/ResultTests/NoContentResult").subscribe(this.handleResponse);
  }

  noContentPost(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/NoContentResult", null).subscribe(this.handleResponse);
  }

  okGet(): void {
    this.httpClient.get(environment.serviceApiUrl + "/ResultTests/OkResult?message=test").subscribe(this.handleResponse);
  }

  okPost(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/OkResult", { message: "ok - test" }).subscribe(this.handleResponse);
  }

  modelStateError(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/ModelStateErrorResult", null).subscribe();
  }

  notFound(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/NotFoundResult", null).subscribe();
  }

  unauthorized(): void {
    this.httpClient.post(environment.serviceApiUrl + "/ResultTests/UnauthorizedResult", null).subscribe();
  }

  private handleResponse(response: Response) {
    console.log("response", response);
  }
}
