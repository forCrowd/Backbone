import { Component, OnInit } from "@angular/core";

import { Project } from "../core/entities/project";
import { AdminService } from "./admin.service";


import {MatTableDataSource} from '@angular/material';

@Component({
    selector: "projects",
    templateUrl: "projects.component.html",
    styleUrls: ["projects.component.css"]
})
export class ProjectsComponent implements OnInit {

    displayedColumns = ['Project', 'User', 'Ratings', 'Created', 'Modified', 'Number'];
    myDataSource = new MatTableDataSource();

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
                this.myDataSource.data = response.results;
            });
    }
}
