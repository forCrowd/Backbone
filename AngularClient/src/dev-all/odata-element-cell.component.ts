import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { mergeMap, map } from "rxjs/operators";

import { AppSettings } from "../app-settings/app-settings";
import { Element, Project, User, AuthService, getUniqueValue } from "forcrowd-backbone";

@Component({
  selector: "odata-element-cell",
  templateUrl: "odata-element-cell.component.html"
})
export class ODataElementCellComponent {

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

  private create(userId: number): Observable<any> {

    return this.getElement(userId).pipe(mergeMap((element) => {

      var elementCell = {
        ElementFieldId: element.ElementFieldSet[0].Id,
        ElementItemId: element.ElementItemSet[0].Id,
        StringValue: `New cell ${getUniqueValue()}`
      };

      const url = `${AppSettings.serviceODataUrl}/ElementCell`;

      return this.httpClient.post(url, elementCell);
    }));
  }

  private delete(userId: number): Observable<any> {

    return this.getElement(userId, true).pipe(mergeMap((element) => {

      var elementCell = element.ElementFieldSet[0].ElementCellSet[0];

      const url = this.getODataUrl(elementCell.Id);

      return this.httpClient.delete(url);
    }));
  }

  private getODataUrl(elementCellId: number) {
    return `${AppSettings.serviceODataUrl}/ElementCell(${elementCellId})`;
  }

  private getElement(userId: number, checkHasElementCell = false): Observable<Element> {

    const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet/ElementFieldSet/ElementCellSet,ElementSet/ElementItemSet&$filter=UserId eq ${userId}`;

    return this.httpClient.get(url).pipe(
      map((response) => {

        var results = (response as any).value as Project[];

        var project = results[0];

        if (!project) {
          throw new Error(`Create a new project first - user: ${userId}`);
        }

        var element = project.ElementSet[0];

        if (!element) {
          throw new Error(`Create a new element first - user: ${userId} - project: ${project.Id}`);
        }

        if (!element.ElementFieldSet[0]) {
          throw new Error(`Create a new field first - user: ${userId} - project: ${project.Id} - element: ${element.Id}`);
        }

        if (!element.ElementItemSet[0]) {
          throw new Error(`Create a new item first - user: ${userId} - project: ${project.Id} - element: ${element.Id}`);
        }

        if (checkHasElementCell && !element.ElementFieldSet[0].ElementCellSet[0]) {
          throw new Error(`Create a new item first - user: ${userId} - project: ${project.Id} - element: ${element.Id} - element field: ${element.ElementFieldSet[0].Id}`);
        }

        return element;
      }));
  }

  private handleResponse(response) {
    console.log("response", response);
  }

  private update(userId: number): Observable<any> {

    return this.getElement(userId, true).pipe(mergeMap((element) => {

      var elementCell = element.ElementFieldSet[0].ElementCellSet[0];

      var body = {
        StringValue: `Updated cell ${getUniqueValue()}`,
        RowVersion: elementCell.RowVersion
      };

      const url = this.getODataUrl(elementCell.Id);

      return this.httpClient.patch(url, body);
    }));
  }
}
