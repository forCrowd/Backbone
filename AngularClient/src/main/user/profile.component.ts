import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatTableDataSource } from "@angular/material";

import { Project } from "../core/entities/project";
import { User } from "../core/entities/user";
import { ProjectService } from "../core/core.module";
import { ProfileRemoveProjectComponent } from "./profile-remove-project.component";
import { UserService } from "./user.service";

@Component({
    selector: "profile",
    templateUrl: "profile.component.html",
    styleUrls: ["profile.component.css"]
})
export class ProfileComponent implements OnInit {

    displayedColumns = ["name", "ratingCount", "createdOn", "functions"];
    dataSource = new MatTableDataSource<Project>([]);
    user: User = null;

    constructor(private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private projectService: ProjectService,
        private router: Router,
        private userService: UserService) {
    }

    confirmRemove(project: Project) {

        const dialogRef = this.dialog.open(ProfileRemoveProjectComponent);

        dialogRef.afterClosed().subscribe(confirmed => {

            if (!confirmed) return;

            this.dataSource.data = [];
            this.projectService.removeProject(project);
            this.userService.saveChanges()
                .finally(() => {
                    this.dataSource.data = this.user.ProjectSet;
                }).subscribe();
        });
    }

    ngOnInit(): void {

        // UserName
        const userName = this.activatedRoute.snapshot.params["username"];

        // If profile user equals to current (authenticated) user
        if (userName === this.userService.currentUser.UserName) {
            this.user = this.userService.currentUser;
            this.dataSource.data = this.user.ProjectSet;
        } else {

            // If not, then check it against remote
            this.userService.getUser(userName)
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
    }

    trackBy(index: number, item: Project) {
        return item.Id;
    }

    userActionsEnabled(): boolean {
        return this.user === this.userService.currentUser;
    }
}
