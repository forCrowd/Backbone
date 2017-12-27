import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppSettings } from "../app-settings/app-settings";
import { Element } from "../main/core/entities/element";
import { Project } from "../main/core/entities/project";
import { User } from "../main/core/entities/user";
import { AuthService } from "../main/core/auth.service";
import { getUniqueValue } from "../main/shared/utils";

@Component({
    selector: "odata-element-field",
    templateUrl: "odata-element-field.component.html"
})
export class ODataElementFieldComponent {

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

        return this.getElement(userId).mergeMap((element) => {

            var elementField = {
                ElementId: element.Id,
                Name: `New field ${getUniqueValue()}`
            };

            const url = `${AppSettings.serviceODataUrl}/ElementField`;

            return this.httpClient.post(url, elementField);
        });
    }

    private delete(userId: number): Observable<any> {

        return this.getElement(userId, true).mergeMap((element) => {

            var elementField = element.ElementFieldSet[0];

            const url = this.getODataUrl(elementField.Id);

            return this.httpClient.delete(url);
        });
    }

    private getODataUrl(elementFieldId: number) {
        return `${AppSettings.serviceODataUrl}/ElementField(${elementFieldId})`;
    }

    private getElement(userId: number, checkHasElementField: boolean = false): Observable<Element> {

        const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet/ElementFieldSet&$filter=UserId eq ${userId}`;

        return this.httpClient.get(url)
            .map((response) => {

                var results = (response as any).value as Project[];

                var project = results[0];

                if (!project) {
                    throw new Error(`Create a new project first - user: ${userId}`);
                }

                var element = project.ElementSet[0];

                if (!element) {
                    throw new Error(`Create a new element first - user: ${userId} - project: ${project.Id}`);
                }

                if (checkHasElementField && !element.ElementFieldSet[0]) {
                    throw new Error(`Create a new field first - user: ${userId} - project: ${project.Id} - element: ${element.Id}`);
                }

                return element;
            });
    }

    private handleResponse(response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<any> {

        return this.getElement(userId, true).mergeMap((element) => {

            var elementField = element.ElementFieldSet[0];

            var body = {
                Name: `Updated field ${getUniqueValue()}`,
                RowVersion: elementField.RowVersion
            };

            const url = this.getODataUrl(elementField.Id);

            return this.httpClient.patch(url, body);
        });
    }
}
