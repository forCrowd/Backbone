import { Component, OnInit } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { ActivatedRoute, Router } from "@angular/router";
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AuthService, Project, User } from "backbone-client-core";
import { finalize } from "rxjs/operators";

import { ProjectService } from "../project.service";
import { ProfileRemoveProjectComponent } from "./profile-remove-project.component";

@Component({
  selector: "profile",
  templateUrl: "profile.component.html",
  styleUrls: ["profile.component.css"]
})
export class ProfileComponent implements OnInit {

  currentUser: User = null;
  displayedColumns = ["select", "name", "ratingCount", "createdOn", "functions"];
  dataSource = new MatTableDataSource<Project>([]);
  selection = new SelectionModel<Project>(true, []);
  user: User = null;
  userName: string = "";

  get isBusy(): boolean {
    return this.authService.isBusy || this.projectService.isBusy;
  };

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private media: ObservableMedia) {
      this.activatedRoute.url.subscribe(url =>{
        if (url.length > 1 && url[1].path !== this.userName) {
          if (this.displayedColumns.length === 3) {
            this.displayedColumns.unshift("select");
            this.displayedColumns.push("functions");
          }
          this.ngOnInit();
        }
      });
      media.subscribe((change: MediaChange) => {
        if ( change.mqAlias === "xs") {
          this.displayedColumns = ["select", "name", "functions"];
        } else {
          this.displayedColumns = ["select", "name", "ratingCount", "createdOn", "functions"];
        }
      });
  }

  confirmRemove() {

    const dialogRef = this.dialog.open(ProfileRemoveProjectComponent);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {

        this.selection.selected.forEach(project => {
          this.projectService.removeProject(project);
        });

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.dataSource.data = this.user.ProjectSet;
          })).subscribe();
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUser;
    var activetedRouteParam = this.activatedRoute.snapshot.params["username"];

    // UserName
    this.userName = activetedRouteParam !== undefined ? activetedRouteParam : this.currentUser.UserName;

    this.authService.getUser(this.userName)
      .subscribe((user) => {

        // Not found, navigate to 404
        if (user === null) {
          const url = window.location.href.replace(window.location.origin, "");
          this.router.navigate(["/app/not-found", { url: url }]);
          return;
        }

        this.user = user;

        if (this.currentUser !== this.user)
          this.displayedColumns = [ "name", "ratingCount", "createdOn"];

        this.dataSource.data = this.user.ProjectSet;
      });

  }

  trackBy(index: number, item: Project) {
    return item.Id;
  }

  userActionsEnabled(): boolean {
    return this.user === this.authService.currentUser;
  }
}
