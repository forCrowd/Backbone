import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { mergeMap, finalize } from "rxjs/operators";

import { User } from "forcrowd-backbone";
import { AuthService, AppEntityManager } from "../core/core.module";

@Injectable()
export class UserService {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  get isBusy(): boolean {
    return this.appEntityManager.isBusy || this.authService.isBusy || this.isBusyLocal;
  }

  private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

  constructor(private appEntityManager: AppEntityManager,
    private authService: AuthService) {
  }

  getUser(userName: string): Observable<User> {
    return this.authService.getUser(userName);
  }

  saveChanges(): Observable<void> {
    this.isBusyLocal = true;
    return this.authService.ensureAuthenticatedUser().pipe(
      mergeMap(() => {
          return this.appEntityManager.saveChangesObservable();
      }),
      finalize(() => {
        this.isBusyLocal = false;
      }));
  }
}
