import { Component, OnInit } from "@angular/core";

import { AdminService } from "./admin.service";
import { User } from "../core/entities/user";

@Component({
    selector: "admin-overview",
    templateUrl: "admin-overview.component.html"
})
export class AdminOverviewComponent implements OnInit {

    projectCount: number = 0;
    userCount: number = 0;

    get currentUser(): User {
        return this.adminService.currentUser;
    }

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {

        this.adminService.getProjectSet(true).subscribe((response) => {
            this.projectCount = response.count;
        });

        this.adminService.getUserCount().subscribe((count) => {
            this.userCount = count;
        });
    }
}
