import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { ElementField } from "../main/core/entities/element-field";
import { Project } from "../main/core/entities/project";
import { User } from "../main/core/entities/user";
import { AppHttp } from "../main/core/app-http.service";
import { AuthService } from "../main/core/auth.service";

@Component({
    selector: "odata-user-element-field",
    templateUrl: "odata-user-element-field.component.html"
})
export class ODataUserElementFieldComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }
    get invalidElementFieldId(): number {
        return -1;
    }
    get invalidUserId(): number {
        return -1;
    }

    constructor(
        private authService: AuthService,
        http: Http) {
        this.appHttp = http as AppHttp;
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
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementFieldId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementFieldId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getElementField(userId).mergeMap((elementField) => {

            var userElementField = {
                UserId: userId,
                ElementFieldId: elementField.Id,
                Rating: new Date().getMilliseconds().toString()
            };

            var url = `${AppSettings.serviceODataUrl}/UserElementField`;

            return this.appHttp.post(url, userElementField);
        });
    }

    private delete(userId: number): Observable<Response> {

        return this.getElementField(userId, true).mergeMap((elementField) => {

            const url = this.getODataUrl(userId, elementField.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(userId: number, elementFieldId: number) {
        return `${AppSettings.serviceODataUrl}/UserElementField(userId=${userId},elementFieldId=${elementFieldId})`;
    }

    private getElementField(userId: number, checkHasUserElementField: boolean = false): Observable<ElementField> {

        const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet/ElementFieldSet/UserElementFieldSet&$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

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

                if (checkHasUserElementField && !elementField.UserElementFieldSet[0]) {
                    throw new Error(`Create a new user field first - user: ${userId} - project: ${project.Id} - element: ${element.Id} - field: ${elementField.Id}`);
                }

                return elementField;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getElementField(userId, true).mergeMap((elementField) => {

            var userElementField = elementField.UserElementFieldSet[0];

            var body = {
                Rating: new Date().getMilliseconds().toString(),
                RowVersion: userElementField.RowVersion
            };

            const url = this.getODataUrl(userId, elementField.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
