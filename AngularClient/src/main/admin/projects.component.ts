import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { Project } from "backbone-client-core";
import { AdminService } from "./admin.service";

@Component({
  selector: "projects",
  templateUrl: "projects.component.html",
  styleUrls: ["projects.component.css"]
})
export class ProjectsComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns = ["name", "user", "ratingCount", "createdOn", "modifiedOn", "functions"];

  constructor(private adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
    this.getProjectSet().subscribe();
  }

  updateComputedFields(project: Project): void {
    this.adminService.updateComputedFields(project).pipe(
      mergeMap(() => {
        return this.getProjectSet(true);
      })).subscribe();
  }

  private getProjectSet(forceRefresh = false): Observable<void> {
    return this.adminService.getProjectSet(false, forceRefresh).pipe(
      map((response) => {
        this.dataSource.data = response.results;
      }));
  }
}
