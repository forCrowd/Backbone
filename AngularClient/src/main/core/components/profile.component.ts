import { Component, OnDestroy, OnInit } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MediaObserver } from "@angular/flex-layout";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AuthService, Project, ProjectService, User } from "@forcrowd/backbone-client-core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { ProfileRemoveProjectComponent } from "./profile-remove-project.component";

@Component({
  selector: "profile",
  templateUrl: "profile.component.html",
  styleUrls: ["profile.component.css"]
})
export class ProfileComponent implements OnDestroy, OnInit {

  currentUser: User = null;
  displayedColumns = ["select", "name", "ratingCount", "createdOn", "functions"];
  dataSource = new MatTableDataSource<Project>([]);
  mediaQuery = "";
  profileUser: User = null;
  selection = new SelectionModel<Project>(true, []);
  subscriptions: Subscription[] = [];

  get isBusy(): boolean {
    return this.authService.isBusy || this.projectService.isBusy;
  };

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private media: MediaObserver) {
  }

  confirmRemove() {

    const dialogRef = this.dialog.open(ProfileRemoveProjectComponent);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {

        this.selection.selected.forEach(project => {
          this.projectService.removeProject(project);
        });

        this.selection.clear();

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.dataSource.data = this.profileUser.ProjectSet;
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

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUser;
    const profileUserName = this.activatedRoute.snapshot.params["username"] || this.currentUser.UserName;

    this.authService.getUser(profileUserName)
      .subscribe(user => {

        // Not found, navigate to 404
        if (user === null) {
          const url = window.location.href.replace(window.location.origin, "");
          this.router.navigate(["/app/not-found", { url: url }]);
          return;
        }

        this.profileUser = user;

        this.dataSource.data = this.profileUser.ProjectSet;

        this.setColumns();
      });

    // Media queries
    var mediaSubscription = this.media.media$.subscribe(change => {
      this.mediaQuery = change.mqAlias;
      this.setColumns();
    });
    this.subscriptions.push(mediaSubscription);
  }

  private setColumns() {
    this.displayedColumns = this.currentUser === this.profileUser
      ? (this.mediaQuery !== "xs" && this.mediaQuery !== "sm")
        ? ["select", "name", "ratingCount", "createdOn", "functions"]
        : ["select", "name", "functions"]
      : (this.mediaQuery !== "xs" && this.mediaQuery !== "sm")
        ? ["name", "ratingCount", "createdOn"]
        : ["name", "createdOn"];
  }

  trackBy(index: number, item: Project) {
    return item.Id;
  }
}
