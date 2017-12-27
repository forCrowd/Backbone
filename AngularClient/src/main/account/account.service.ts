import { Injectable, Injector } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { BusyInterceptor } from "../core/app-http-client/busy-interceptor";
import { AuthService } from "../core/auth.service";
import { User } from "../core/entities/user";

@Injectable()
export class AccountService {

    get isBusy(): boolean {
        return this.busyInterceptor.isBusy;
    }

    // Service urls
    addPasswordUrl: string = "";
    changeEmailUrl: string = "";
    changePasswordUrl: string = "";
    changeUserNameUrl: string = "";
    confirmEmailUrl: string = "";
    resendConfirmationEmailUrl: string = "";
    resetPasswordUrl: string = "";
    resetPasswordRequestUrl: string = "";

    private readonly busyInterceptor: BusyInterceptor = null;

    constructor(private authService: AuthService,
        private httpClient: HttpClient,
        private injector: Injector) {

        // Busy interceptor
        var interceptors = injector.get(HTTP_INTERCEPTORS);
        this.busyInterceptor = interceptors.find(i => i instanceof BusyInterceptor) as BusyInterceptor;

        // Service urls
        this.addPasswordUrl = AppSettings.serviceApiUrl + "/Account/AddPassword";
        this.changeEmailUrl = AppSettings.serviceApiUrl + "/Account/ChangeEmail";
        this.changePasswordUrl = AppSettings.serviceApiUrl + "/Account/ChangePassword";
        this.changeUserNameUrl = AppSettings.serviceApiUrl + "/Account/ChangeUserName";
        this.confirmEmailUrl = AppSettings.serviceApiUrl + "/Account/ConfirmEmail";
        this.resendConfirmationEmailUrl = AppSettings.serviceApiUrl + "/Account/ResendConfirmationEmail";
        this.resetPasswordUrl = AppSettings.serviceApiUrl + "/Account/ResetPassword";
        this.resetPasswordRequestUrl = AppSettings.serviceApiUrl + "/Account/ResetPasswordRequest";
    }

    addPassword(addPasswordBindingModel: any) {

        return this.httpClient.post<User>(this.addPasswordUrl, addPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeEmail(changeEmailBindingModel: any) {

        changeEmailBindingModel.ClientAppUrl = window.location.origin;

        return this.httpClient.post<User>(this.changeEmailUrl, changeEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changePassword(changePasswordBindingModel: any) {

        return this.httpClient.post<User>(this.changePasswordUrl, changePasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeUserName(changeUserNameBindingModel: any) {

        return this.httpClient.post<User>(this.changeUserNameUrl, changeUserNameBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    confirmEmail(confirmEmailBindingModel: any): Observable<boolean> {

        return this.httpClient.post<User>(this.confirmEmailUrl, confirmEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
                return true;
            });
    }

    resendConfirmationEmail() {

        const model = { ClientAppUrl: window.location.origin };

        return this.httpClient.post<User>(this.resendConfirmationEmailUrl, model);
    }

    resetPassword(resetPasswordBindingModel: any) {

        return this.httpClient.post<User>(this.resetPasswordUrl, resetPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    resetPasswordRequest(resetPasswordRequestBindingModel: any) {

        resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

        return this.httpClient.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
    }
}
