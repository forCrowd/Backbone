import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery } from "../../libraries/breeze-client";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../core/app-http.service";
import { AuthService } from "../core/auth.service";
import { AppEntityManager } from "../core/app-entity-manager.service";
import { Project } from "../core/entities/project";
import { User } from "../core/entities/user";

@Injectable()
export class AdminService {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    private appHttp: AppHttp;

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService,
        http: Http) {

        this.appHttp = http as AppHttp;
    }

    getProjectSet(onlyCount?: boolean) {
        onlyCount = onlyCount || false;

        let query = EntityQuery.from("Project");

        if (onlyCount) {
            query = query.take(0).inlineCount(true);
        } else {
            query = query.expand(["User"])
                .orderByDesc("ModifiedOn");
        }

        return this.appEntityManager.executeQueryObservable<Project>(query);
    }

    getUserCount() {

        const query = EntityQuery
            .from("Users")
            .take(0)
            .inlineCount(true);

        return this.appEntityManager.executeQueryObservable<User>(query)
            .map((response) => {
                return response.count;
            });
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;

        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesObservable();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    updateComputedFields(project: Project): Observable<void> {

        const url = `${AppSettings.serviceApiUrl}/ProjectApi/${project.Id}/UpdateComputedFields`;

        return this.appHttp.post<void>(url, null);
    }
}
