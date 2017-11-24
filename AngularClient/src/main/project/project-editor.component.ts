import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, Subscription } from "rxjs";
import { Options } from "highcharts";

import { Element } from "../core/entities/element";
import { ElementCell } from "../core/entities/element-cell";
import { ElementField, ElementFieldDataType } from "../core/entities/element-field";
import { IUniqueKey, RatingMode, Project } from "../core/entities/project";
import { User } from "../core/entities/user";
import { AuthService } from "../core/auth.service";
import { ProjectService } from "../core/core.module";
import { ChartConfig, ChartDataItem } from "../shared/ng-chart/ng-chart.module";

export interface IConfig {
    projectUniqueKey: IUniqueKey
};

@Component({
    selector: "project-editor",
    styleUrls: ["project-editor.component.css"],
    templateUrl: "project-editor.component.html"
})
export class ProjectEditorComponent implements OnDestroy, OnInit {

    constructor(private authService: AuthService,
        private projectService: ProjectService,
        private router: Router) {
    }

    @Input()
    config: IConfig = { projectUniqueKey: { projectKey: "", username: "" } };
    chartConfig: ChartConfig = null;
    currentUser: User = null;
    displayChart: boolean = false;
    displayDescription: boolean = false;
    displayIndexDetails = false;
    ElementFieldDataType = ElementFieldDataType;
    elementItemsSortField = "name";
    errorMessage: string = "";
    get isBusy(): boolean {
        return this.projectService.isBusy;
    }
    RatingMode = RatingMode;
    project: Project = null;
    projectKey = "";
    get projectUniqueKey(): IUniqueKey {
        return { username: this.username, projectKey: this.projectKey };
    }
    saveStream = new Subject();
    get selectedElement(): Element {
        return this.fields.selectedElement;
    }
    set selectedElement(value: Element) {
        if (this.fields.selectedElement !== value) {
            this.fields.selectedElement = value;

            this.loadChartData();
        }
    }
    subscriptions: Subscription[] = [];
    username = "";

    private fields: {
        selectedElement: Element,
    } = {
        selectedElement: null,
    }

    decreaseRating(field: ElementField) {
        this.projectService.updateElementFieldRating(field, "decrease");
        this.saveStream.next();
    }

    increaseRating(field: ElementField) {
        this.projectService.updateElementFieldRating(field, "increase");
        this.saveStream.next();
    }

    initialize(username: string, projectKey: string, user: User) {

        // If there is no change, no need to continue
        if (this.username === username && this.projectKey === projectKey && this.currentUser === user) {
            return;
        }

        this.username = username;
        this.projectKey = projectKey;
        this.currentUser = user;

        // Clear previous error messages
        this.errorMessage = "";

        // Validate
        if (this.username === "" || this.projectKey === "") {
            this.errorMessage = "Project unique key cannot be null";
            return;
        }

        // Get project
        this.projectService.getProjectExpanded(this.projectUniqueKey)
            .subscribe(project => {

                if (!project) {
                    this.errorMessage = "Invalid project";
                    return;
                }

                // It returns an array, set the first item in the list
                this.project = project;

                // Rating mode updated event
                // TODO: Unsubscribe?
                this.project.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

                // Selected element
                this.selectedElement = this.project.ElementSet[0];

                this.loadChartData();
            });
    }

    loadChartData() {

        const element = this.selectedElement;

        if (!element) {
            return;
        }

        // Item length check
        if (element.ElementItemSet.length > 20) {
            return;
        }

        if (!this.displayIndexDetails) {

            // TODO Check this rule?

            if (element === element.Project.ElementSet[0]) {

                const options: Options = {
                    title: { text: element.Name },
                    chart: { type: "column" },
                    yAxis: {
                        title: { text: "Total Income" }
                    }
                }
                const data: ChartDataItem[] = [];

                this.chartConfig = new ChartConfig(options, data);

            } else {

                const options: Options = {
                    title: { text: element.Name },
                    chart: { type: "pie" }
                };
                const data: ChartDataItem[] = [];

                element.ElementItemSet.forEach(elementItem => {
                    elementItem.ElementCellSet.forEach(elementCell => {
                        if (elementCell.ElementField.RatingEnabled) {
                            data.push(new ChartDataItem(elementCell.ElementItem.Name,
                                +elementCell.numericValue().toFixed(2),
                                elementCell.numericValueUpdated));
                        }
                    });
                });

                this.chartConfig = new ChartConfig(options, data);
            }

        } else {

            const options = {
                title: { text: "Indexes" },
                chart: { type: "pie" }
            };

            const data: ChartDataItem[] = [];

            element.elementFieldSet()
                .forEach(field => {
                    data.push(new ChartDataItem(field.Name,
                        +field.rating().toFixed(2),
                        field.ratingUpdated));
                });

            this.chartConfig = new ChartConfig(options, data);
        }
    }

    manageProject(): void {
        const editLink = `/${this.config.projectUniqueKey.username}/${this.config.projectUniqueKey.projectKey}/edit`;
        this.router.navigate([editLink]);
    }

    manageProjectEnabled(): boolean {
        return this.project.User === this.currentUser;
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        const username = typeof this.config.projectUniqueKey.username === "undefined" ? "" : this.config.projectUniqueKey.username;
        const projectKey = typeof this.config.projectUniqueKey.projectKey === "undefined" ? "" : this.config.projectUniqueKey.projectKey;

        // Delayed save operation
        this.saveStream.debounceTime(1500)
            .mergeMap(() => this.projectService.saveChanges()).subscribe();

        // Event handlers
        const currentUserChangedSubscription = this.authService.currentUserChanged.subscribe(currentUser => {
            this.initialize(this.username, this.projectKey, currentUser);
        });
        this.subscriptions.push(currentUserChangedSubscription);

        // Refresh project timer
        const refreshProject = 1000 * 60 * 30;

        this.subscriptions.push(
            Observable.timer(refreshProject, refreshProject).mergeMap(() => {
                return this.projectService.getProjectExpanded(this.project.uniqueKey, true);
            }).subscribe()
        );

        this.initialize(username, projectKey, this.authService.currentUser);
    }

    resetRating(field: ElementField) {
        this.projectService.updateElementFieldRating(field, "reset");
        this.saveStream.next();
    }

    toggleDescription() {
        this.displayDescription = !this.displayDescription;
    }

    // Index Details
    toggleIndexDetails() {
        this.displayIndexDetails = !this.displayIndexDetails;
        this.loadChartData();
    }

    updateElementCellDecimalValue(cell: ElementCell, value: number) {
        this.projectService.updateElementCellDecimalValue(cell, value);
        this.saveStream.next();
    }

    updateElementItemsSortField(): void {
        this.elementItemsSortField = this.project.RatingMode === RatingMode.CurrentUser
            ? "name"
            : "income";
    }
}
