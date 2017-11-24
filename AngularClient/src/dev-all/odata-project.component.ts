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
    selector: "odata-project",
    templateUrl: "odata-project.component.html"
})
export class ODataProjectComponent {

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

    constructor(private authService: AuthService,
        http: Http) {
        this.appHttp = http as AppHttp;
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
        this.appHttp.delete(url).subscribe(this.handleResponse);
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
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    private create(userId: number): Observable<Response> {

        const project = {
            UserId: userId,
            Name: `New project ${getUniqueValue()}`,
            Key: `New-project-${getUniqueValue()}`,
            Description: "Description of the project",
        };

        const url = `${AppSettings.serviceODataUrl}/Project`;

        return this.appHttp.post(url, project);
    }

    private delete(userId: number): Observable<Response> {

        return this.get(userId).mergeMap(project => {

            const url = this.getODataUrl(project.Id);

            return this.appHttp.delete(url);
        });
    }

    private get(userId: number): Observable<Project> {

        const url = `${AppSettings.serviceODataUrl}/Project?$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

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

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId): Observable<Response> {

        return this.get(userId).mergeMap((project) => {

            var body = {
                Name: `Updated project ${getUniqueValue()}`,
                RowVersion: project.RowVersion
            };

            const url = this.getODataUrl(project.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
