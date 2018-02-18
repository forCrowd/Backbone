import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { Element } from "../core/entities/element";
import { Project } from "../core/entities/project";
import { ProjectService } from "../core/core.module";

@Component({
    selector: "element-manager",
    templateUrl: "element-manager.component.html",
    styleUrls: ["element-manager.component.css"]
})
export class ElementManagerComponent implements OnInit {

    @Input() project: Project = null;
    @Output() isEditingChanged = new EventEmitter<boolean>();

    elementDataSource = new MatTableDataSource<Element>([]);
    elementDisplayedColumns = ["name", "createdOn", "functions"];

    get selectedElement(): Element {
        return this.fields.selectedElement;
    }
    set selectedElement(value: Element) {
        if (this.fields.selectedElement !== value) {
            this.fields.selectedElement = value;

            this.isEditingChanged.emit(value ? true : false);
        }
    }

    private fields: {
        project: Project,
        selectedElement: Element,
    } = {
        project: null,
        selectedElement: null,
    }

    get isBusy(): boolean {
        return this.projectService.isBusy;
    }

    constructor(private projectService: ProjectService) { }

    addElement(): void {
        this.selectedElement = this.projectService.createElement({
            Project: this.project,
            Name: "New element"
        }) as Element;
    }

    cancelElement(): void {
        this.projectService.rejectChangesElement(this.selectedElement);
        this.selectedElement = null;
    }

    editElement(element: Element): void {
        this.selectedElement = element;
    }

    ngOnInit(): void {
        this.elementDataSource.data = this.project.ElementSet;
    }

    removeElement(element: Element): void {

        this.elementDataSource.data = null;
        this.projectService.removeElement(element);
        
        this.projectService.saveChanges()
            .finally(() => {
                this.elementDataSource.data = this.project.ElementSet;
            }).subscribe();
    }

    saveElement(): void {
        this.projectService.saveChanges().subscribe(() => {
            this.selectedElement = null;
        });
    }

    submitDisabled(): boolean {
        return this.isBusy || this.selectedElement.entityAspect.getValidationErrors().length > 0;
    }

    trackBy(index: number, element: Element) {
        return element.Id;
    }
}
