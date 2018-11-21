import { Component, OnInit } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { Project, User } from "backbone-client-core";
import { finalize } from "rxjs/operators";

import { ProjectService } from '../core/project.service';
import { ProfileRemoveProjectComponent } from "./profile-remove-project.component";
import { UserService } from "./user.service";

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
    return this.projectService.isBusy || this.userService.isBusy;
  };

  constructor(private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService) {
  }

  confirmRemove() {

    const dialogRef = this.dialog.open(ProfileRemoveProjectComponent);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {

        this.selection.selected.forEach(project => {
          this.projectService.removeProject(project);
        });

        this.userService.saveChanges().pipe(
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

    this.currentUser = this.userService.currentUser;
    var activetedRouteParam = this.activatedRoute.snapshot.params["username"];

    // UserName
    this.userName = activetedRouteParam !== undefined ? activetedRouteParam : this.currentUser.UserName;

    this.userService.getUser(this.userName)
      .subscribe((user) => {

        // Not found, navigate to 404
        if (user === null) {
          const url = window.location.href.replace(window.location.origin, "");
          this.router.navigate(["/app/not-found", { url: url }]);
          return;
        }

        this.user = user;
        this.dataSource.data = this.user.ProjectSet;
      });

  }

  trackBy(index: number, item: Project) {
    return item.Id;
  }

  userActionsEnabled(): boolean {
    return this.user === this.userService.currentUser;
  }
}
