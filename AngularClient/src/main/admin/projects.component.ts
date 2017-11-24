import { Component, OnInit } from "@angular/core";

import { Project } from "../core/entities/project";
import { AdminService } from "./admin.service";

@Component({
    selector: "projects",
    templateUrl: "projects.component.html"
})
export class ProjectsComponent implements OnInit {

    projectSet: Project[] = [];

    constructor(private adminService: AdminService) {
    }

    ngOnInit(): void {
        this.getProjectSet();
    }

    updateComputedFields(project: Project): void {
        this.adminService.updateComputedFields(project).subscribe(() => {
            this.getProjectSet();
        });
    }

    private getProjectSet(): void {
        this.adminService.getProjectSet()
            .subscribe((response) => {
                this.projectSet = response.results;
            });
    }
}
