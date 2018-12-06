import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Project, User, NotificationService } from "@forcrowd/backbone-client-core";

import { AdminService } from "./admin.service";
import { finalize, mergeMap, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "admin-overview",
  templateUrl: "admin-overview.component.html",
  styleUrls: ["admin-overview.component.css"],
})
export class AdminOverviewComponent implements OnInit {
  projectDataSource = new MatTableDataSource<Project>([]);
  userDataSource = new MatTableDataSource<User>([]);

  // Displayed Columns
  userDisplayedColumns = ["username", "projects", "confirm", "date"];
  projectDisplayedColumns = ["name", "user", "origin", "date", "functions"];

  projectCount: number = 0;
  userCount: number = 0;
  hasResult = false;

  //for Project statistics
  projects: Project[] = [];
  todaysProject: Project[] = [];
  lastMonthProjects: Project[] = [];
  lastWeekProjects: Project[] = [];
  projectsTitle: string = null;

  //for User statistics
  users: User[] = null;
  lastMonthUsers: User[] = [];
  lastWeekUsers: User[] = [];
  todaysUser: User[] = [];
  usersTitle: string = null;

  // Date
  date = new Date();
  weekFirstDay = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 7).toISOString().split('T')[0]; //Last week first day
  weekLastDay = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()).toISOString().split('T')[0]; // Last week last day
  monthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth() - 2, 1).toISOString().split('T')[0];
  monthLastDay = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 0).toISOString().split('T')[0];
  today = this.date.toISOString().split('T')[0];

  get currentUser(): User {
    return this.adminService.currentUser;
  }

  constructor(private adminService: AdminService, private notificationService: NotificationService) { }

  formatDate(v: Date): string {
    return v.toISOString().split('T')[0];
  }

  setProjectDataSource(data: Project[], title: string): void {
    this.projectDataSource.data = data;
    this.projectsTitle = title;
    this.notificationService.notification.next("Please look at the project table");
  }

  setUserDataSource(data: User[], title: string): void {
    this.userDataSource.data = data;
    this.usersTitle = title;
    this.notificationService.notification.next("Please look at the user table");
  }

  getTodaysProject(): void {
    this.projects.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn === this.today)
        this.todaysProject.push(e);
    });
  }

  getLastMonthProjects(): void {
    this.projects.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn >= this.monthFirstDay && createdOn <= this.monthLastDay)
        this.lastMonthProjects.push(e);
    });
  }

  getLastWeekProjects(): void {
    this.projects.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn >= this.weekFirstDay && createdOn <= this.weekLastDay)
        this.lastWeekProjects.push(e);
    });
  }

  getTodayUsers(): void {
    this.users.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn === this.today)
        this.todaysUser.push(e);
    });
  }

  getLastMonthUsers(): void {
    this.users.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn >= this.monthFirstDay && createdOn <= this.monthLastDay)
        this.lastMonthUsers.push(e);
    });
  }

  getLastWeekUsers(): void {
    this.users.forEach((e) => {
      var createdOn = this.formatDate(e.CreatedOn);
      if (createdOn >= this.weekFirstDay && createdOn <= this.weekLastDay)
        this.lastWeekUsers.push(e);
    });
  }

  ngOnInit(): void {
    this.adminService.getProject().pipe(
      finalize(() => {
        this.projectDataSource.data = this.projects.slice(0, 5);
        this.getTodaysProject();
        this.getLastMonthProjects();
        this.getLastWeekProjects();
        this.hasResult = true;
      }))
      .subscribe(response => {
        this.projects = response.results
        this.projectCount = response.count;
      });

    this.adminService.getUser().pipe(
      finalize(() => {
        this.userDataSource.data = this.users.slice(0, 5);
        this.getTodayUsers();
        this.getLastWeekUsers();
        this.getLastMonthUsers();
      }))
      .subscribe((response) => {
        this.users = response.results;
        this.userCount = response.count;
      });
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
        this.projectDataSource.data = response.results;
      }));
  }

  trackBy(index: number, item: Project): number {
    return item.Id;
  }
}
