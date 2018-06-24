import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppSettings } from "../app-settings/app-settings";
import { Project } from "../main/core/entities/project";
import { User } from "../main/core/entities/user";

import { AuthService } from "../main/core/core.module";
import { getUniqueValue } from "../main/shared/utils";

@Component({
  selector: "odata-project",
  templateUrl: "odata-project.component.html"
})
export class ODataProjectComponent {

  get anotherUserId(): number {
    return 2;
  }

  get currentUser(): User {
    return this.authService.currentUser;
  }
  get invalidUserId(): number {
    return -1;
  }

  constructor(private authService: AuthService,
    private httpClient: HttpClient) {

  }

  createAnother(): void {
    this.create(this.anotherUserId)
      .subscribe(this.handleResponse);
  }

  createOwn(): void {
    this.create(this.currentUser.Id).subscribe(this.handleResponse);
  }

  deleteAnother(): void {
    this.delete(this.anotherUserId).subscribe(this.handleResponse);
  }

  deleteNotFound(): void {
    const url = this.getODataUrl(this.invalidUserId);
    this.httpClient.delete(url).subscribe(this.handleResponse);
  }

  deleteOwn(): void {
    this.delete(this.currentUser.Id).subscribe(this.handleResponse);
  }

  getAnother(): void {
    this.get(this.anotherUserId).subscribe((project) => console.log("project", project));
  }

  getOwn(): void {
    this.get(this.currentUser.Id).subscribe((project) => console.log("project", project));
  }

  updateAnother(): void {
    this.update(2).subscribe(this.handleResponse);
  }

  updateNotFound(): void {
    const url = this.getODataUrl(this.invalidUserId);
    this.httpClient.patch(url, {}).subscribe(this.handleResponse);
  }

  updateOwn(): void {
    this.update(this.currentUser.Id).subscribe(this.handleResponse);
  }

  private create(userId: number): Observable<any> {

    const project = {
      UserId: userId,
      Name: `New project ${getUniqueValue()}`,
      Key: `New-project-${getUniqueValue()}`,
      Origin: `http://localhost:15001`,
      Description: "Description of the project",
    };

    const url = `${AppSettings.serviceODataUrl}/Project`;

    return this.httpClient.post(url, project);
  }

  private delete(userId: number): Observable<any> {

    return this.get(userId).mergeMap(project => {

      const url = this.getODataUrl(project.Id);

      return this.httpClient.delete(url);
    });
  }

  private get(userId: number): Observable<Project> {

    const url = `${AppSettings.serviceODataUrl}/Project?$filter=UserId eq ${userId}`;

    return this.httpClient.get(url)
      .map((response) => {

        var results = (response as any).value;

        var project = results[0];

        if (!project) {
          throw new Error(`Create a new project first - user: ${userId}`);
        }

        return project;
      });
  }

  private getODataUrl(projectId: number) {
    return `${AppSettings.serviceODataUrl}/Project(${projectId})`;
  }

  private handleResponse(response) {
    console.log("response", response);
  }

  private update(userId): Observable<any> {

    return this.get(userId).mergeMap((project) => {

      var body = {
        Name: `Updated project ${getUniqueValue()}`,
        RowVersion: project.RowVersion
      };

      const url = this.getODataUrl(project.Id);

      return this.httpClient.patch(url, body);
    });
  }
}
