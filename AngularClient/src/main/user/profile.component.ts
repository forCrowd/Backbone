import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatTableDataSource } from "@angular/material";

import { Project } from "../core/entities/project";
import { User } from "../core/entities/user";
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
        private router: Router,
        private userService: UserService) {
    }

    confirmRemove(project: Project) {

        const dialogRef = this.dialog.open(ProfileRemoveProjectComponent);

        dialogRef.afterClosed().subscribe(result => {

            if (!result) return;

            project.remove();

            this.userService.saveChanges().subscribe(() => {
                this.dataSource.data = this.user.ProjectSet;
            });
        });
    }

    getProjectLink(project: Project): string {
        return `/${project.User.UserName}/${project.Key}`;
    }

    manageProject(project: Project): void {
        const editLink = `${this.getProjectLink(project)}/edit`;
        this.router.navigate([editLink]);
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

    viewProject(project: Project) {
        const editLink = this.getProjectLink(project);
        this.router.navigate([editLink]);
    }
}
