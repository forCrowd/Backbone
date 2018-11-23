import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { Project } from "backbone-client-core";
import { finalize } from "rxjs/operators";

import { ProjectService } from "../project.service";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["search.component.css"]
})
export class SearchComponent {

  isBusy: boolean;
  displayedColumns = ["name", "userName", "ratingCount", "createdOn"];
  dataSource = new MatTableDataSource<Project>([]);
  hasResult = false;
  searchKey = "";

  constructor(private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private media: ObservableMedia) {
      this.activatedRoute.url.subscribe(url =>{
        this.searchKey = url[1].parameters.searchKey;
        this.search();
      });
      media.subscribe((change: MediaChange) => {
        if ( change.mqAlias === "xs" ) {
          this.displayedColumns = ["name", "userName"];
        } else {
          this.displayedColumns = ["name", "userName", "ratingCount", "createdOn"];
        }
      });
  }

  search(): void {
    this.isBusy = true;

    this.projectService.getProjectSet(this.searchKey).pipe(
      finalize(() => {
        this.isBusy = false;
      }))
      .subscribe(results => {
        this.dataSource.data = results;
        this.hasResult = true;
      });
  }

  trackBy(index: number, item: Project): number {
    return item.Id;
  }

}
