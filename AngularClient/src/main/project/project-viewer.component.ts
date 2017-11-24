import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ProjectService } from "../core/core.module";
import { IProjectEditorConfig } from "../project/project.module";

@Component({
    selector: "project-viewer",
    templateUrl: "project-viewer.component.html"
})
export class ProjectViewerComponent implements OnInit {

    editorConfig: IProjectEditorConfig = {
        projectUniqueKey: {
            projectKey: "",
            username: ""
        }
    };

    constructor(private activatedRoute: ActivatedRoute,
        private projectService: ProjectService,
        private router: Router) {
    }

    ngOnInit(): void {

        const projectKey = this.activatedRoute.snapshot.params["projectKey"];
        const username = this.activatedRoute.snapshot.params["username"];

        this.editorConfig.projectUniqueKey = {
            projectKey: projectKey,
            username: username
        };

        // Title
        this.projectService.getProjectExpanded(this.editorConfig.projectUniqueKey)
            .subscribe(project => {

                // Not found, navigate to 404
                if (!project) {
                    const url = window.location.href.replace(window.location.origin, "");
                    this.router.navigate(["/app/not-found", { url: url }]);
                    return;
                }
            });
    }
}
