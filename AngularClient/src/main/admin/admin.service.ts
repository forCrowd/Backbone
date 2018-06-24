import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EntityQuery } from "../../libraries/breeze-client";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { Project } from "../core/entities/project";
import { User } from "../core/entities/user";
import { AppEntityManager, AppHttpClient, AuthService } from "../core/core.module";

@Injectable()
export class AdminService {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  get isBusy(): boolean {
    return this.appEntityManager.isBusy || this.appHttpClient.isBusy || this.isBusyLocal;
  }
  private readonly appHttpClient: AppHttpClient = null;
  private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

  constructor(private appEntityManager: AppEntityManager,
    private authService: AuthService,
    private httpClient: HttpClient) {

    this.appHttpClient = httpClient as AppHttpClient;
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
