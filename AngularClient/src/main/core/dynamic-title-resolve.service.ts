import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { IUniqueKey } from "./entities/project";
import { ProjectService } from "./project.service";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

    constructor(private authService: AuthService, private projectService: ProjectService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<string> {

        const username = route.params["username"];
        const projectKey = route.params["projectKey"];
        const lastUrl = route.url[route.url.length - 1];

        if (username && projectKey) { // Project title

            let title = "";

            // Project unique key
            const projectUniqueKey: IUniqueKey = {
                username: username,
                projectKey: projectKey
            };

            return this.projectService.getProjectExpanded(projectUniqueKey)
                .map((project): string => {

                    if (project !== null) {

                        title += project.User.UserName + " - " + project.Name;
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
