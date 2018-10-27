import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { mergeMap, map } from "rxjs/operators";

import { AppSettings } from "../app-settings/app-settings";
import { Project, User, AuthService, getUniqueValue } from "forcrowd-backbone";

@Component({
  selector: "odata-element",
  templateUrl: "odata-element.component.html"
})
export class ODataElementComponent {

  get anotherUserId(): number {
    return 2;
  }

  get currentUser(): User {
    return this.authService.currentUser;
  }
  get invalidUserId(): number {
    return -1;
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {

  }

  createAnother(): void {
    this.create(this.anotherUserId).subscribe(this.handleResponse);
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

  updateAnother(): void {
    this.update(this.anotherUserId).subscribe(this.handleResponse);
  }

  updateNotFound(): void {
    const url = this.getODataUrl(this.invalidUserId);
    this.httpClient.patch(url, {}).subscribe(this.handleResponse);
  }

  updateOwn(): void {
    this.update(this.currentUser.Id).subscribe(this.handleResponse);
  }

  /* Private methods */

  private create(userId: number): Observable<any> {

    return this.getProject(userId).pipe(mergeMap(project => {

      var element = {
        ProjectId: project.Id,
        Name: `New element ${getUniqueValue()}`
      };

      const url = `${AppSettings.serviceODataUrl}/Element`;

      return this.httpClient.post(url, element);
    }));
  }

  private delete(userId: number): Observable<any> {

    return this.getProject(userId, true).pipe(mergeMap(project => {

      var element = project.ElementSet[0];

      const url = this.getODataUrl(element.Id);

      return this.httpClient.delete(url);
    }));
  }

  private getODataUrl(elementId: number) {
    return `${AppSettings.serviceODataUrl}/Element(${elementId})`;
  }

  private getProject(userId: number, checkHasElement: boolean = false): Observable<Project> {

    const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet&$filter=UserId eq ${userId}`;

    return this.httpClient.get(url).pipe(
      map((response) => {

        var results = (response as any).value as Project[];

        var project = results[0];

        if (!project) {
          throw new Error(`Create a new project first - user: ${userId}`);
        }

        if (checkHasElement && !project.ElementSet[0]) {
          throw new Error(`Create a new element first - user: ${userId} - project: ${project.Id}`);
        }

        return project;
      }));
  }

  private handleResponse(response) {
    console.log("response", response);
  }

  private update(userId: number): Observable<any> {

    return this.getProject(userId, true).pipe(mergeMap((project) => {

      var element = project.ElementSet[0];

      var body = {
        Name: `Updated element ${getUniqueValue()}`,
        RowVersion: element.RowVersion
      };

      const url = this.getODataUrl(element.Id);

      return this.httpClient.patch(url, body);
    }));
  }
}
