import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { ProjectService } from "./project.service";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

  constructor(private authService: AuthService, private projectService: ProjectService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {

    const username = route.params["username"];
    const projectId = route.params["project-id"];
    const lastUrl = route.url[route.url.length - 1];

    if (projectId) { // Project title

      let title = "";

      return this.projectService.getProjectExpanded(projectId)
        .map((project): string => {

          if (project !== null) {

            title += project.Name;

            if (lastUrl && lastUrl.path === "edit") {
              title += " - Edit";
            }
          }

          return title;
        });

    } else if (username) { // User title

      return this.authService.getUser(username)
        .map((user): string => {

          let title = "";

          if (user !== null) {
            title = user.UserName;

            if (lastUrl && lastUrl.path === "new") {
              title += " - New";
            }
          }

          return title;
        });

    } else { // None

      return Observable.of("");
    }
  }
}
