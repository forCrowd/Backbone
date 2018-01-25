import { Injectable, Injector } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { EntityQuery } from "../../libraries/breeze-client";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { BusyInterceptor } from "../core/app-http-client/busy-interceptor";
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
        return this.appEntityManager.isBusy || this.busyInterceptor.isBusy || this.isBusyLocal;
    }
    private readonly busyInterceptor: BusyInterceptor = null;
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService,
        private httpClient: HttpClient,
        private injector: Injector) {

        // Busy interceptor
        var interceptors = injector.get(HTTP_INTERCEPTORS);
        this.busyInterceptor = interceptors.find(i => i instanceof BusyInterceptor) as BusyInterceptor;
    }

    getProjectSet(onlyCount = false, forceRefresh = false) {

        let query = EntityQuery.from("Project");

        if (onlyCount) {
            query = query.take(0).inlineCount(true);
        } else {
            query = query.expand(["User"])
                .orderByDesc("ModifiedOn");
        }

        return this.appEntityManager.executeQueryObservable<Project>(query, forceRefresh);
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

        return this.httpClient.post<void>(url, null);
    }
}
