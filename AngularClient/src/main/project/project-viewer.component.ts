import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AppSettings } from "../../app-settings/app-settings";
import { ProjectService } from "../core/core.module";
import { IUniqueKey, Project } from "../core/entities/project";

@Component({
    selector: "project-viewer",
    templateUrl: "project-viewer.component.html"
})
export class ProjectViewerComponent implements OnInit {

    project: Project = null;
    serviceODataUrl = AppSettings.serviceODataUrl;

    get projectBasicApiUrl(): string {
        return `${AppSettings.serviceODataUrl}/Project(${this.project.Id})`;
    }

    get projectGuestExpandedApiUrl(): string {
        return `${AppSettings.serviceODataUrl}/Project(${this.project.Id})?$expand=User,ElementSet/ElementFieldSet,ElementSet/ElementItemSet/ElementCellSet`;
    }

    get projectOwnerExpandedApiUrl(): string {
        return `${AppSettings.serviceODataUrl}/Project(${this.project.Id})?$expand=User,ElementSet/ElementFieldSet/UserElementFieldSet,ElementSet/ElementItemSet/ElementCellSet/UserElementCellSet`;
    }

    get metadataUrl(): string {
        return `${AppSettings.serviceODataUrl}/$metadata`;
    }

    constructor(private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private router: Router) {
    }

    ngOnInit(): void {

        const projectKey = this.activatedRoute.snapshot.params["projectKey"];
        const username = this.activatedRoute.snapshot.params["username"];

        var projectUniqueKey: IUniqueKey = {
            projectKey: projectKey,
            username: username
        };

        // Title
        this.projectService.getProjectExpanded(projectUniqueKey)
            .subscribe(project => {

                // Not found, navigate to 404
                if (!project) {
                    const url = window.location.href.replace(window.location.origin, "");
                    this.router.navigate(["/app/not-found", { url: url }]);
                    return;
                }

                this.project = project;
            });
    }
}
