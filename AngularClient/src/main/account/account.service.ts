import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../core/app-http.service";
import { AuthService } from "../core/auth.service";
import { User } from "../core/entities/user";

@Injectable()
export class AccountService {

    appHttp: AppHttp;
    get isBusy(): boolean {
        return this.appHttp.isBusy;
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

    constructor(private authService: AuthService,
        private http: Http) {

        this.appHttp = http as AppHttp;

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

        return this.appHttp.post<User>(this.addPasswordUrl, addPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeEmail(changeEmailBindingModel: any) {

        changeEmailBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.changeEmailUrl, changeEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changePassword(changePasswordBindingModel: any) {

        return this.appHttp.post<User>(this.changePasswordUrl, changePasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeUserName(changeUserNameBindingModel: any) {

        return this.appHttp.post<User>(this.changeUserNameUrl, changeUserNameBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    confirmEmail(confirmEmailBindingModel: any): Observable<boolean> {

        return this.appHttp.post<User>(this.confirmEmailUrl, confirmEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
                return true;
            });
    }

    resendConfirmationEmail() {

        const model = { ClientAppUrl: window.location.origin };

        return this.appHttp.post<User>(this.resendConfirmationEmailUrl, model);
    }

    resetPassword(resetPasswordBindingModel: any) {

        return this.appHttp.post<User>(this.resetPasswordUrl, resetPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    resetPasswordRequest(resetPasswordRequestBindingModel: any) {

        resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
    }
}
