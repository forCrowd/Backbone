import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";

import { Element } from "../core/entities/element";
import { ElementCell } from "../core/entities/element-cell";
import { ElementField, ElementFieldDataType } from "../core/entities/element-field";
import { ElementItem } from "../core/entities/element-item";
import { Project } from "../core/entities/project";
import { User } from "../core/entities/user";
import { ProjectService } from "../core/core.module";
import { NotificationService } from "../core/notification.service";

@Component({
    selector: "project-manager",
    templateUrl: "project-manager.component.html",
    styleUrls: ["project-manager.component.css"]
})
export class ProjectManagerComponent implements OnInit {

    elementCell: ElementCell = null;
    elementCellDataSource = new MatTableDataSource<ElementCell>([]);
    elementCellDisplayedColumns = ["elementItem", "value", "createdOn", "functions"];
    elementDataSource = new MatTableDataSource<Element>([]);
    elementDisplayedColumns = ["name", "createdOn", "functions"];
    elementField: ElementField = null;
    elementFieldDataSource = new MatTableDataSource<ElementField>([]);
    elementFieldDisplayedColumns = ["element", "name", "dataType", "createdOn", "functions"];
    elementFieldDataType = ElementFieldDataType;
    elementItem: ElementItem = null;
    elementItemDataSource = new MatTableDataSource<ElementItem>([]);
    elementItemDisplayedColumns = ["element", "name", "createdOn", "functions"];
    isElementCellEdit = false;
    isElementFieldEdit = false;
    isElementItemEdit = false;
    get isBusy(): boolean {
        return this.projectService.isBusy;
    };
    get project(): Project {
        return this.fields.project;
    }
    set project(value: Project) {
        if (this.fields.project !== value) {
            this.fields.project = value;

            this.elementDataSource.data = this.project.ElementSet;
        }
    }
    selectedElement: Element = null;

    get selectedFilterElement(): Element {
        return this.fields.selectedFilterElement;
    }
    set selectedFilterElement(value: Element) {
        if (this.fields.selectedFilterElement !== value) {
            this.fields.selectedFilterElement = value;

            this.elementFieldDataSource.data = value.ElementFieldSet;
            this.elementItemDataSource.data = value.ElementItemSet;
        }
    }

    get selectedFilterElementField(): ElementField {
        return this.fields.selectedFilterElementField;
    }
    set selectedFilterElementField(value: ElementField) {
        if (this.fields.selectedFilterElementField !== value) {
            this.fields.selectedFilterElementField = value;

            this.elementCellDataSource.data = value.ElementCellSet;
        }
    }

    user: User;
    viewMode = "new"; // new | existing

    private fields: {
        project: Project,
        selectedFilterElement: Element,
        selectedFilterElementField: ElementField,
    } = {
        project: null,
        selectedFilterElement: null,
        selectedFilterElementField: null,
    }

    constructor(private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private projectService: ProjectService,
        private router: Router
    ) { }

    addElement() {
        this.selectedElement = this.projectService.createElement({
            Project: this.project,
            Name: "New element"
        }) as Element;
    }

    addElementField() {

        const selectedElement = this.project.ElementSet[0];

        // A temp fix for default value of "SortOrder"
        // Later handle "SortOrder" by UI, not by asking
        const sortOrder = selectedElement.ElementFieldSet.length + 1;

        this.elementField = this.projectService.createElementField({
            Element: selectedElement,
            Name: "New field",
            DataType: ElementFieldDataType.String,
            SortOrder: sortOrder
        });

        this.isElementFieldEdit = true;
    }

    addElementItem() {
        this.elementItem = this.projectService.createElementItem({
            Element: this.project.ElementSet[0],
            Name: "New item"
        });
        this.isElementItemEdit = true;
    }

    cancelElementCell() {
        this.elementCell.rejectChanges();
        this.isElementCellEdit = false;
        this.elementCell = null;
    }

    cancelElementField() {
        this.elementField.rejectChanges();
        this.isElementFieldEdit = false;
        this.elementField = null;
    }

    cancelElementItem() {
        this.elementItem.rejectChanges();
        this.isElementItemEdit = false;
        this.elementItem = null;
    }

    cancelProject() {

        this.project.entityAspect.rejectChanges();

        const command = `/users/${this.project.User.UserName}`;
        this.router.navigate([command]);
    }

    canDeactivate() {

        if (!this.projectService.hasChanges()) {
            return true;
        }

        if (confirm("Discard changes?")) {
            this.projectService.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    createProjectEmpty(): void {
        this.project = this.projectService.createProjectEmpty();

        this.projectService.saveChanges()
            .subscribe(() => {
                const command = `/projects/${this.project.Id}/edit`;
                this.router.navigate([command]);
            });
    }

    createProjectBasic(): void {
        this.project = this.projectService.createProjectBasic();

        this.projectService.saveChanges()
            .subscribe(() => {
                const command = `/projects/${this.project.Id}/edit`;
                this.router.navigate([command]);
            });
    }

    editElement(element: Element) {
        this.selectedElement = element;
    }

    editElementCell(elementCell: ElementCell) {
        this.elementCell = elementCell;
        this.isElementCellEdit = true;
    }

    editElementField(elementField: ElementField) {
        this.elementField = elementField;
        this.isElementFieldEdit = true;
    }

    editElementItem(elementItem: ElementItem) {
        this.elementItem = elementItem;
        this.isElementItemEdit = true;
    }

    elementCellSet() {

        const elementItems = this.elementItemSet();

        var list: ElementCell[] = [];
        elementItems.forEach(elementItem => {
            elementItem.ElementCellSet.forEach(elementCell => {
                list.push(elementCell);
            });
        });
        return list;
    }

    elementFieldSet() {
        var list: ElementField[] = [];
        this.project.ElementSet.forEach(element => {
            element.ElementFieldSet.forEach(field => {
                list.push(field);
            });
        });
        return list;
    }

    elementItemSet() {
        var list: ElementItem[] = [];
        this.project.ElementSet.forEach(element => {
            element.ElementItemSet.forEach(item => {
                list.push(item);
            });
        });
        return list;
    }

    ngOnInit(): void {

        this.viewMode = this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path === "new"
            ? "new"
            : "existing";

        if (this.viewMode === "existing") {

            const projectId: number = this.activatedRoute.snapshot.params["project-id"];

            this.projectService.getProjectExpanded(projectId)
                .subscribe(project => {

                    // Not found, navigate to 404
                    if (!project) {
                        const url = window.location.href.replace(window.location.origin, "");
                        this.router.navigate(["/app/not-found", { url: url }]);
                        return;
                    }

                    this.project = project;
                });
        }
    }

    onElementManagerClosed() {
        this.selectedElement = null;
    }

    removeElement(element: Element) {
        element.remove();
        this.elementDataSource.data = this.project.ElementSet;
        this.projectService.saveChanges().subscribe();
    }

    removeElementField(elementField: ElementField) {
        elementField.remove();
        this.elementFieldDataSource.data = this.selectedFilterElement.ElementFieldSet;
        this.projectService.saveChanges().subscribe();
    }

    removeElementItem(elementItem: ElementItem) {
        elementItem.remove();
        this.elementItemDataSource.data = this.selectedFilterElement.ElementItemSet;
        this.projectService.saveChanges().subscribe();
    }

    saveElementCell() {
        this.projectService.saveChanges()
            .subscribe(() => {
                this.isElementCellEdit = false;
                this.elementCell = null;
            });
    }

    saveElementField() {

        // Related cells
        if (this.elementField.ElementCellSet.length === 0) {
            this.elementField.Element.ElementItemSet.forEach(elementItem => {
                this.projectService.createElementCell({
                    ElementField: this.elementField,
                    ElementItem: elementItem
                });
            });
        }

        this.projectService.saveChanges()
            .subscribe(() => {
                this.isElementFieldEdit = false;
                this.elementField = null;
            });
    }

    saveElementItem() {

        // Related cells
        if (this.elementItem.ElementCellSet.length === 0) {
            this.elementItem.Element.ElementFieldSet.forEach(elementField => {
                this.projectService.createElementCell({
                    ElementField: elementField,
                    ElementItem: this.elementItem
                });
            });
        }

        this.projectService.saveChanges()
            .subscribe(() => {
                this.isElementItemEdit = false;
                this.elementItem = null;
            });
    }

    saveProject() {
        this.projectService.saveChanges()
            .subscribe(() => {

                this.notificationService.notification.next("Your changes have been saved!");

                const command = `/projects/${this.project.Id}`;
                this.router.navigate([command]);
            });
    }

    submitDisabled(entity: string) {

        let hasValidationErrors = false;

        switch (entity) {
            case "project": {
                hasValidationErrors = this.project.entityAspect.getValidationErrors().length > 0;
                break;
            }
            case "elementField": {
                hasValidationErrors = (this.elementField.entityAspect.getValidationErrors().length
                    + (this.elementField.UserElementFieldSet.length > 0 ? this.elementField.UserElementFieldSet[0].entityAspect.getValidationErrors().length : 0)) > 0;
                break;
            }
            case "elementItem": {
                hasValidationErrors = this.elementItem.entityAspect.getValidationErrors().length > 0;
                break;
            }
            case "elementCell": {
                hasValidationErrors = (this.elementCell.entityAspect.getValidationErrors().length
                    + (this.elementCell.UserElementCellSet.length > 0 ? this.elementCell.UserElementCellSet[0].entityAspect.getValidationErrors().length : 0)) > 0;
                break;
            }
        }

        return this.isBusy || hasValidationErrors;
    }

    trackBy(index: number, entity: any) {
        return entity.Id;
    }
}
