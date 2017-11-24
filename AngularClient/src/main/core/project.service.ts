import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery, Predicate } from "../../libraries/breeze-client";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "./app-http.service";
import { Element } from "./entities/element";
import { ElementCell } from "./entities/element-cell";
import { ElementField, ElementFieldDataType } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { IUniqueKey, Project } from "./entities/project";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { AppEntityManager } from "./app-entity-manager.service";
import { AuthService } from "./auth.service";
import { getUniqueValue } from "../shared/utils";

@Injectable()
export class ProjectService {

    get isBusy(): boolean { 
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }

    private appHttp: AppHttp;
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    constructor(private appEntityManager: AppEntityManager, private authService: AuthService, http: Http) {
        this.appHttp = http as AppHttp;
    }

    createElement(initialValues: Object) {
        return this.appEntityManager.createEntity("Element", initialValues);
    }

    createElementCell(initialValues: Object) {

        const elementCell = this.appEntityManager.createEntity("ElementCell", initialValues) as ElementCell;

        // User element cell
        if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {
            elementCell.NumericValueTotal = 50;
            elementCell.NumericValueCount = 1;

            this.createUserElementCell(elementCell, null);
        }

        return elementCell;
    }

    createElementField(initialValues: Object) {

        const elementField = this.appEntityManager.createEntity("ElementField", initialValues) as ElementField;

        if (elementField.RatingEnabled) {
            elementField.RatingTotal = 50; // Computed field
            elementField.RatingCount = 1; // Computed field

            this.createUserElementField(elementField);
        }

        // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
        // Event handlers
        elementField.dataTypeChanged.subscribe(elementField => { this.elementField_DataTypeChanged(elementField); });
        elementField.ratingEnabledChanged.subscribe(elementField => { this.elementField_RatingEnabledChanged(elementField); });

        return elementField;
    }

    createElementItem(initialValues: Object): ElementItem {
        return this.appEntityManager.createEntity("ElementItem", initialValues) as ElementItem;
    }

    createProjectEmpty(): Project {

        const project = this.appEntityManager.createEntity("Project", {
            User: this.authService.currentUser
        }) as Project;

        project.Name = `New project ${getUniqueValue()}`;
        project.RatingCount = 1; // Computed field

        return project;
    }

    createProjectBasic() {

        const project = this.createProjectEmpty();

        const element = this.createElement({
            Project: project,
            Name: "New element"
        }) as Element;

        // Field
        const elementField = this.createElementField({
            Element: element,
            Name: "New field",
            DataType: 4,
            UseFixedValue: false,
            RatingEnabled: true,
            SortOrder: 1
        }) as ElementField;

        // Item 1
        const elementItem1 = this.createElementItem({
            Element: element,
            Name: "New item 1"
        }) as ElementItem;

        // Cell 1
        this.createElementCell({
            ElementField: elementField,
            ElementItem: elementItem1
        });

        // Item 2
        const elementItem2 = this.createElementItem({
            Element: element,
            Name: "New item 2"
        });

        // Cell 2
        this.createElementCell({
            ElementField: elementField,
            ElementItem: elementItem2
        });

        return project;
    }

    createUserElementCell(elementCell: ElementCell, value: any) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementCell.Id];
        let userElementCell = this.appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

        if (userElementCell) {

            // If it's deleted, restore it
            if (userElementCell.entityAspect.entityState.isDeleted()) {
                userElementCell.entityAspect.rejectChanges();
            }

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

        } else {

            const userElementCellInitial = {
                User: this.authService.currentUser,
                ElementCell: elementCell
            } as any;

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

            userElementCell = this.appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
        }

        return userElementCell;
    }

    createUserElementField(elementField: ElementField, rating: number = 50) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementField.Id];
        let userElementField = this.appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

        if (userElementField) {

            // If it's deleted, restore it
            if (userElementField.entityAspect.entityState.isDeleted()) {
                userElementField.entityAspect.rejectChanges();
            }

            userElementField.Rating = rating;

        } else {

            const userElementFieldInitial = {
                User: this.authService.currentUser,
                ElementField: elementField,
                Rating: rating
            };

            userElementField = this.appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
        }

        return userElementField;
    }

    elementField_DataTypeChanged(elementField: ElementField) {

        // Related element cells: Clear old values and set default values if necessary
        elementField.ElementCellSet.forEach(elementCell => {

            elementCell.SelectedElementItem = null;
            elementCell.StringValue = "";

            if (elementCell.UserElementCellSet[0]) {
                elementCell.UserElementCellSet[0].entityAspect.setDeleted();
            }

            if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {
                this.createUserElementCell(elementCell, null);
            }
        });
    }

    elementField_RatingEnabledChanged(elementField: ElementField) {

        // Add user element field, if RatingEnabled and there is none
        if (elementField.RatingEnabled && !elementField.UserElementFieldSet[0]) {
            this.createUserElementField(elementField);
        } else if (!elementField.RatingEnabled && elementField.UserElementFieldSet[0]) {
            if (elementField.UserElementFieldSet[0]) {
                elementField.UserElementFieldSet[0].entityAspect.setDeleted();
            }
        }
    }

    getProjectExpanded(projectUniqueKey: IUniqueKey, forceRefresh = false) {

        // Prepare the query
        let query = EntityQuery.from("Project");

        // Is authorized? No, then get only the public data, yes, then get include user's own records
        if (this.authService.currentUser.isAuthenticated()) {
            query = query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet");
        } else {
            query = query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");
        }

        const userNamePredicate = new Predicate("User.UserName", "eq", projectUniqueKey.username);
        const projectKeyPredicate = new Predicate("Key", "eq", projectUniqueKey.projectKey);

        query = query.where(userNamePredicate.and(projectKeyPredicate));

        return this.appEntityManager.executeQueryObservable<Project>(query, forceRefresh)
            .map(response => {

                // If there is no project with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // Project
                var project = response.results[0];

                // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
                // Events handlers
                project.ElementSet.forEach(element => {
                    element.ElementFieldSet.forEach(elementField => {
                        elementField.dataTypeChanged.subscribe(elementField => { this.elementField_DataTypeChanged(elementField); });
                        elementField.ratingEnabledChanged.subscribe(elementField => { this.elementField_RatingEnabledChanged(elementField); });
                    });
                });

                return project;
            });
    }

    getProjectSet(searchKey: string = "") {

        let query = EntityQuery
            .from("Project")
            .expand(["User"])
            .orderBy("Name");

        if (searchKey !== "") {
            const projectNamePredicate = new Predicate("Name", "contains", searchKey);
            const userNamePredicate = new Predicate("User.UserName", "contains", searchKey);
            query = query.where(projectNamePredicate.or(userNamePredicate));
        }

        return this.appEntityManager.executeQueryObservable<Project>(query)
            .map(response => {
                return response.results;
            });
    }

    hasChanges(): boolean {
        return this.appEntityManager.hasChanges();
    }

    // Currently not in use
    refreshComputedFields(project: Project): Observable<void> {

        const updateComputedFieldsUrl = this.getUpdateComputedFieldsUrl(project.Id);

        return this.appHttp.post<void>(updateComputedFieldsUrl, null).mergeMap(() => {
            return this.getProjectExpanded(project.uniqueKey, true).map(() => { });
        });
    }

    rejectChanges(): void {
        this.appEntityManager.rejectChanges();
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;
        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesObservable();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    // These "updateX" functions were defined in their related entities (user.js).
    // Only because they had to use createEntity() on dataService, it was moved to this service.
    // Try do handle them in a better way, maybe by using broadcast?
    updateElementCellDecimalValue(elementCell: ElementCell, value: number) {

        const userElementCell = elementCell.UserElementCellSet[0];

        if (!userElementCell) { // If there is no item, create it

            this.createUserElementCell(elementCell, value);

        } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

            userElementCell.DecimalValue = value;

        }
    }

    updateElementFieldRatingNew(elementField: ElementField, value: number) {

        // If there is no item, create it
        if (!elementField.UserElementFieldSet[0]) {

            this.createUserElementField(elementField, value);

        } else { // If there is an item, set the Rating

            elementField.UserElementFieldSet[0].Rating = value;

        }
    }

    updateElementFieldRating(elementField: ElementField, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                const userElementField = elementField.UserElementFieldSet[0];

                // If there is no item, create it
                if (!userElementField) {

                    const rating = updateType === "increase" ? 55 : 45;
                    this.createUserElementField(elementField, rating);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                    userElementField.Rating = updateType === "increase" ?
                        userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                        userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                }

                break;
            }
            case "reset": {

                if (elementField.UserElementFieldSet[0]) {
                    elementField.UserElementFieldSet[0].Rating = 50;
                }

                break;
            }
        }
    }

    private getUpdateComputedFieldsUrl(projectId: number) {
        return `${AppSettings.serviceApiUrl}/ProjectApi/${projectId}/UpdateComputedFields`;
    }
}
