import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";

import { Project } from "../entities/project";
import { ProjectService } from "../project.service";

@Component({
    selector: "search",
    templateUrl: "search.component.html",
    styleUrls: ["search.component.css"]
})
export class SearchComponent {

    isBusy: boolean;
    displayedColumns = ["name", "userName", "ratingCount", "createdOn", "functions"];
    dataSource = new MatTableDataSource<Project>([]);
    hasResult = false;
    searchKey = "";

    constructor(private projectService: ProjectService, private router: Router) {
    }

    search(): void {

        this.isBusy = true;

        this.projectService.getProjectSet(this.searchKey)
            .finally(() => {
                this.isBusy = false;
            })
            .subscribe(results => {
                this.dataSource.data = results;
                this.hasResult = true;
            });
    }

    trackBy(index: number, item: Project): number {
        return item.Id;
    }
}
