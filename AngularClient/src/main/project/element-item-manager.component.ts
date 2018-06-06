import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { Element } from "../core/entities/element";
import { Project } from "../core/entities/project";
import { ElementItem } from "../core/entities/element-item";
import { ProjectService } from "../core/core.module";

@Component({
  selector: "element-item-manager",
  templateUrl: "element-item-manager.component.html",
  styleUrls: ["element-item-manager.component.css"]
})
export class ElementItemManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();

  elementItemDataSource = new MatTableDataSource<ElementItem>([]);
  elementItemDisplayedColumns = ["element", "name", "createdOn", "functions"];

  get selectedElementItem(): ElementItem {
    return this.fields.selectedElementItem;
  }
  set selectedElementItem(value: ElementItem) {
    if (this.fields.selectedElementItem !== value) {
      this.fields.selectedElementItem = value;

      this.isEditingChanged.emit(value ? true : false);
    }
  }

  get elementFilter(): Element {
    return this.fields.elementFilter;
  }
  set elementFilter(value: Element) {
    if (this.fields.elementFilter !== value) {
      this.fields.elementFilter = value;

      this.elementItemDataSource.data = value ? value.ElementItemSet : [];
    }
  }

  private fields: {
    selectedElementItem: ElementItem,
    elementFilter: Element,
  } = {
      selectedElementItem: null,
      elementFilter: null,
    }

  get isBusy(): boolean {
    return this.projectService.isBusy;
  }

  constructor(private projectService: ProjectService) { }

  addElementItem() {
    this.selectedElementItem = this.projectService.createElementItem({
      Element: this.elementFilter,
      Name: "New item"
    });
  }

  cancelElementItem() {
    var elementItem = this.selectedElementItem;
    this.selectedElementItem = null;
    this.projectService.rejectChangesElementItem(elementItem);
  }

  editElementItem(elementItem: ElementItem) {
    this.selectedElementItem = elementItem;
  }

  ngOnInit(): void {
    this.elementFilter = this.project.ElementSet[0];
  }

  removeElementItem(elementItem: ElementItem) {
    this.elementItemDataSource.data = null;
    this.projectService.removeElementItem(elementItem);
    this.projectService.saveChanges()
      .finally(() => {
        this.elementItemDataSource.data = this.elementFilter.ElementItemSet;
      }).subscribe();
  }

  saveElementItem() {
    this.projectService.saveElementItem(this.selectedElementItem)
      .subscribe(() => {
        this.selectedElementItem = null;
      });
  }

  submitDisabled(): boolean {
    return this.isBusy || this.selectedElementItem.entityAspect.getValidationErrors().length > 0;
  }

  trackBy(index: number, elementItem: ElementItem) {
    return elementItem.Id;
  }
}
