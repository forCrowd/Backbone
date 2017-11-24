import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { Project } from "../main/core/entities/project";
import { User } from "../main/core/entities/user";
import { AppHttp } from "../main/core/app-http.service";
import { AuthService } from "../main/core/auth.service";
import { getUniqueValue } from "../main/shared/utils";

@Component({
    selector: "odata-element",
    templateUrl: "odata-element.component.html"
})
export class ODataElementComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
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
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getProject(userId).mergeMap(project => {

                var element = {
                    ProjectId: project.Id,
                    Name: `New element ${getUniqueValue()}`
                };

                const url = `${AppSettings.serviceODataUrl}/Element`;

                return this.appHttp.post(url, element);
            });
    }

    private delete(userId: number): Observable<Response> {

        return this.getProject(userId, true).mergeMap(project => {

            var element = project.ElementSet[0];

            const url = this.getODataUrl(element.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(elementId: number) {
        return `${AppSettings.serviceODataUrl}/Element(${elementId})`;
    }

    private getProject(userId: number, checkHasElement: boolean = false): Observable<Project> {

        const url = `${AppSettings.serviceODataUrl}/Project?$expand=ElementSet&$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

                var results = (response as any).value as Project[];

                var project = results[0];

                if (!project) {
                    throw new Error(`Create a new project first - user: ${userId}`);
                }

                if (checkHasElement && !project.ElementSet[0]) {
                    throw new Error(`Create a new element first - user: ${userId} - project: ${project.Id}`);
                }

                return project;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getProject(userId, true).mergeMap((project) => {

            var element = project.ElementSet[0];

            var body = {
                Name: `Updated element ${getUniqueValue()}`,
                RowVersion: element.RowVersion
            };

            const url = this.getODataUrl(element.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
