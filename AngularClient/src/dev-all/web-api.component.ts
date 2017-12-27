import { Component, Injector } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";

import { AppSettings } from "../app-settings/app-settings";
import { BusyInterceptor } from "../main/core/app-http-client/busy-interceptor";

@Component({
    selector: "web-api",
    templateUrl: "web-api.component.html"
})
export class WebApiComponent {

    private readonly busyInterceptor: BusyInterceptor = null;

    get isBusy(): boolean {
        return this.busyInterceptor.isBusy;
    }

    constructor(
        private httpClient: HttpClient,
        private injector: Injector) {

        var interceptors = injector.get(HTTP_INTERCEPTORS);
        this.busyInterceptor = interceptors.find(i => i instanceof BusyInterceptor) as BusyInterceptor;
    }

    badRequest(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/BadRequestResult", null).subscribe();
    }

    badRequestMessage(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/BadRequestMessageResult", null).subscribe();
    }

    conflict(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/ConflictResult", null).subscribe();
    }

    exception(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/ExceptionResult", null).subscribe();
    }

    internalServerError(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/InternalServerErrorResult", null).subscribe();
    }

    noContentGet(): void {
        this.httpClient.get(AppSettings.serviceApiUrl + "/ResultTests/NoContentResult").subscribe(this.handleResponse);
    }

    noContentPost(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/NoContentResult", null).subscribe(this.handleResponse);
    }

    okGet(): void {
        this.httpClient.get(AppSettings.serviceApiUrl + "/ResultTests/OkResult?message=test").subscribe(this.handleResponse);
    }

    okPost(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/OkResult", { message: "ok - test" }).subscribe(this.handleResponse);
    }

    modelStateError(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/ModelStateErrorResult", null).subscribe();
    }

    notFound(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/NotFoundResult", null).subscribe();
    }

    unauthorized(): void {
        this.httpClient.post(AppSettings.serviceApiUrl + "/ResultTests/UnauthorizedResult", null).subscribe();
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }
}
