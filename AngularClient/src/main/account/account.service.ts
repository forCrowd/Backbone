import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

//import { AppSettings } from "../../app-settings/app-settings";
import { AppHttpClient, AuthService, User, SettingsService } from "forcrowd-backbone";

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
  resendConfirmationEmailUrl = "";
  resetPasswordUrl = "";
  resetPasswordRequestUrl = "";

  private readonly appHttpClient: AppHttpClient = null;

  constructor(private authService: AuthService,
    private httpClient: HttpClient,
    private settingsService: SettingsService) {

    this.appHttpClient = httpClient as AppHttpClient;

    // Service urls
    this.addPasswordUrl = settingsService.getServiceApiUrl() + "/Account/AddPassword";
    this.changeEmailUrl = settingsService.getServiceApiUrl() + "/Account/ChangeEmail";
    this.changePasswordUrl = settingsService.getServiceApiUrl() + "/Account/ChangePassword";
    this.changeUserNameUrl = settingsService.getServiceApiUrl() + "/Account/ChangeUserName";
    this.confirmEmailUrl = settingsService.getServiceApiUrl() + "/Account/ConfirmEmail";
    this.resendConfirmationEmailUrl = settingsService.getServiceApiUrl() + "/Account/ResendConfirmationEmail";
    this.resetPasswordUrl = settingsService.getServiceApiUrl() + "/Account/ResetPassword";
    this.resetPasswordRequestUrl = settingsService.getServiceApiUrl() + "/Account/ResetPasswordRequest";
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
