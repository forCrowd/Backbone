import { Component } from "@angular/core";
import { Http } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { AppHttp } from "../main/core/app-http.service";
import { AuthService } from "../main/core/auth.service";

@Component({
    selector: "web-api",
    templateUrl: "web-api.component.html"
})
export class WebApiComponent {

    appHttp: AppHttp;

    constructor(
        private authService: AuthService,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    badRequest(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/BadRequestResult", null).subscribe();
    }

    badRequestMessage(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/BadRequestMessageResult", null).subscribe();
    }

    conflict(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/ConflictResult", null).subscribe();
    }

    exception(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/ExceptionResult", null).subscribe();
    }

    internalServerError(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/InternalServerErrorResult", null).subscribe();
    }

    noContentGet(): void {
        this.appHttp.get(AppSettings.serviceApiUrl + "/ResultTests/NoContentResult").subscribe(this.handleResponse);
    }

    noContentPost(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/NoContentResult", null).subscribe(this.handleResponse);
    }

    okGet(): void {
        this.appHttp.get(AppSettings.serviceApiUrl + "/ResultTests/OkResult?message=test").subscribe(this.handleResponse);
    }

    okPost(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/OkResult", { message: "ok - test" }).subscribe(this.handleResponse);
    }

    modelStateError(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/ModelStateErrorResult", null).subscribe();
    }

    notFound(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/NotFoundResult", null).subscribe();
    }

    unauthorized(): void {
        this.appHttp.post(AppSettings.serviceApiUrl + "/ResultTests/UnauthorizedResult", null).subscribe();
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }
}
