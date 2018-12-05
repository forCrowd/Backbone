import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppHttpClient, AuthService, User } from "@forcrowd/backbone-client-core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { settings } from "../../settings/settings";

@Injectable()
export class AccountService {

  get isBusy(): boolean {
    return this.appHttpClient.isBusy;
  }

  // Service urls
  addPasswordUrl = "";
  changeEmailUrl = "";
  changePasswordUrl = "";
  changeUserNameUrl = "";
  confirmEmailUrl = "";
  deleteAccountUrl = "";
  resendConfirmationEmailUrl = "";
  resetPasswordUrl = "";
  resetPasswordRequestUrl = "";

  private readonly appHttpClient: AppHttpClient = null;

  constructor(private authService: AuthService,
    private httpClient: HttpClient) {

    this.appHttpClient = httpClient as AppHttpClient;

    // Service urls
    this.addPasswordUrl = settings.serviceApiUrl + "/Account/AddPassword";
    this.changeEmailUrl = settings.serviceApiUrl + "/Account/ChangeEmail";
    this.changePasswordUrl = settings.serviceApiUrl + "/Account/ChangePassword";
    this.changeUserNameUrl = settings.serviceApiUrl + "/Account/ChangeUserName";
    this.confirmEmailUrl = settings.serviceApiUrl + "/Account/ConfirmEmail";
    this.deleteAccountUrl = settings.serviceApiUrl + "/Account/DeleteAccount";
    this.resendConfirmationEmailUrl = settings.serviceApiUrl + "/Account/ResendConfirmationEmail";
    this.resetPasswordUrl = settings.serviceApiUrl + "/Account/ResetPassword";
    this.resetPasswordRequestUrl = settings.serviceApiUrl + "/Account/ResetPasswordRequest";
  }

  addPassword(addPasswordBindingModel: any) {

    return this.httpClient.post<User>(this.addPasswordUrl, addPasswordBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
      }));
  }

  changeEmail(changeEmailBindingModel: any) {

    changeEmailBindingModel.ClientAppUrl = window.location.origin;

    return this.httpClient.post<User>(this.changeEmailUrl, changeEmailBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
      }));
  }

  changePassword(changePasswordBindingModel: any) {

    return this.httpClient.post<User>(this.changePasswordUrl, changePasswordBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
      }));
  }

  changeUserName(changeUserNameBindingModel: any) {

    return this.httpClient.post<User>(this.changeUserNameUrl, changeUserNameBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
      }));
  }

  confirmEmail(confirmEmailBindingModel: any): Observable<boolean> {

    return this.httpClient.post<User>(this.confirmEmailUrl, confirmEmailBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
        return true;
      }));
  }

  deleteAccount() {

    return this.httpClient.delete(this.deleteAccountUrl).pipe(
      map(() => {
        this.authService.logout();
      }));
  }

  resendConfirmationEmail() {

    const model = { ClientAppUrl: window.location.origin };

    return this.httpClient.post<User>(this.resendConfirmationEmailUrl, model);
  }

  resetPassword(resetPasswordBindingModel: any) {

    return this.httpClient.post<User>(this.resetPasswordUrl, resetPasswordBindingModel).pipe(
      map(updatedUser => {
        this.authService.updateCurrentUser(updatedUser);
      }));
  }

  resetPasswordRequest(resetPasswordRequestBindingModel: any) {

    resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

    return this.httpClient.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
  }
}
