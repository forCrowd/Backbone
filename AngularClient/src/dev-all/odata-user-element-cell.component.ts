import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { mergeMap, map } from "rxjs/operators";

import { AppSettings } from "../app-settings/app-settings";
import { ElementCell, Project, User } from "forcrowd-backbone";
import { AuthService } from "../main/core/core.module";

@Component({
  selector: "odata-user-element-cell",
  templateUrl: "odata-user-element-cell.component.html"
})
export class ODataUserElementCellComponent {

  get anotherUserId(): number {
    return 2;
  }

  get currentUser(): User {
    return this.authService.currentUser;
  }
  get invalidElementCellId(): number {
    return -1;
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
    const url = this.getODataUrl(this.invalidUserId, this.invalidElementCellId);
    this.httpClient.delete(url).subscribe(this.handleResponse);
  }

  deleteOwn(): void {
    this.delete(this.currentUser.Id).subscribe(this.handleResponse);
  }

  updateAnother(): void {
    this.update(this.anotherUserId).subscribe(this.handleResponse);
  }

  updateNotFound(): void {
    const url = this.getODataUrl(this.invalidUserId, this.invalidElementCellId);
    this.httpClient.patch(url, {}).subscribe(this.handleResponse);
  }

  updateOwn(): void {
    this.update(this.currentUser.Id).subscribe(this.handleResponse);
  }

  /* Private methods */

  private create(userId: number): Observable<any> {

    return this.getElementCell(userId).pipe(mergeMap((elementCell) => {

      var userElementCell = {
        UserId: userId,
        ElementCellId: elementCell.Id,
        DecimalValue: new Date().getMilliseconds().toString()
      };

      var url = `${AppSettings.serviceODataUrl}/UserElementCell`;

      return this.httpClient.post(url, userElementCell);
    }));
  }

  private delete(userId: number): Observable<any> {

    return this.getElementCell(userId, true).pipe(mergeMap((elementCell) => {

      const url = this.getODataUrl(userId, elementCell.Id);

      return this.httpClient.delete(url);
    }));
  }

  private getODataUrl(userId: number, elementCellId: number) {
    return `${AppSettings.serviceODataUrl}/UserElementCell(userId=${userId},elementCellId=${elementCellId})`;
  }

  private getElementCell(userId: number, checkHasUserElementCell: boolean = false): Observable<ElementCell> {

    const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet/ElementFieldSet/ElementCellSet/UserElementCellSet&$filter=UserId eq ${userId}`;

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

        var elementField = element.ElementFieldSet[0];

        if (!elementField) {
          throw new Error(`Create a new field first - user: ${userId} - project: ${project.Id} - element: ${element.Id}`);
        }

        var elementCell = elementField.ElementCellSet[0];

        if (!elementCell) {
          throw new Error(`Create a new cell first - user: ${userId} - project: ${project.Id} - element: ${element.Id} - element field: ${elementField.Id}`);
        }

        if (checkHasUserElementCell && !elementCell.UserElementCellSet[0]) {
          throw new Error(`Create a new user field first - user: ${userId} - project: ${project.Id} - element: ${element.Id} - field: ${elementField.Id} - element cell: ${elementCell.Id}`);
        }

        return elementCell;
      }));
  }

  private handleResponse(response) {
    console.log("response", response);
  }

  private update(userId: number): Observable<any> {

    return this.getElementCell(userId, true).pipe(mergeMap((elementCell) => {

      var userElementCell = elementCell.UserElementCellSet[0];

      var body = {
        DecimalValue: new Date().getMilliseconds().toString(),
        RowVersion: userElementCell.RowVersion
      };

      const url = this.getODataUrl(userId, elementCell.Id);

      return this.httpClient.patch(url, body);
    }));
  }
}
