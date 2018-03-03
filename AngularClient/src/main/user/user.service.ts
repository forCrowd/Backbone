import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { User } from "../core/entities/user";
import { AuthService, AppEntityManager } from "../core/core.module";

@Injectable()
export class UserService {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService) {
    }

    getUser(userName: string): Observable<User> {
        return this.authService.getUser(userName);
    }

    saveChanges(): Observable<void> {
        return this.authService.ensureAuthenticatedUser().mergeMap(() => {
            return this.appEntityManager.saveChangesObservable();
        });
    }
}
