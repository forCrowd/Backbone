import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { Project } from "backbone-client-core";
import { finalize } from "rxjs/operators";

import { ProjectService } from "../project.service";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["search.component.css"]
})
export class SearchComponent implements OnInit {

  isBusy: boolean;
  displayedColumns = ["name", "userName", "ratingCount", "createdOn"];
  dataSource = new MatTableDataSource<Project>([]);
  hasResult = false;
  searchKey = "";

  constructor(private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.activatedRoute.url.subscribe(url =>{
        this.searchKey = url[1].parameters.searchKey;
        this.search();
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

    ngOnInit(): void {
      this.searchKey = this.activatedRoute.snapshot.params["searchKey"];
      if (this.searchKey) this.search();
    }

  }
