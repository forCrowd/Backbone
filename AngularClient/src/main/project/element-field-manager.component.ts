import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { finalize } from "rxjs/operators";

import { Element } from "../core/entities/element";
import { Project } from "../core/entities/project";
import { ElementField, ElementFieldDataType } from "../core/entities/element-field";
import { ProjectService } from "../core/core.module";

@Component({
  selector: "element-field-manager",
  templateUrl: "element-field-manager.component.html",
  styleUrls: ["element-field-manager.component.css"]
})
export class ElementFieldManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();

  elementFieldDataSource = new MatTableDataSource<ElementField>([]);
  elementFieldDisplayedColumns = ["element", "name", "dataType", "createdOn", "functions"];
  elementFieldDataType = ElementFieldDataType;
  selectedElementList: Element[] = [];

  get selectedElementField(): ElementField {
    return this.fields.selectedElementField;
  }
  set selectedElementField(value: ElementField) {
    if (this.fields.selectedElementField !== value) {
      this.fields.selectedElementField = value;

      // Prepare selected element list
      if (this.selectedElementField) {
        this.selectedElementList = this.project.ElementSet
          .filter(element => element !== this.selectedElementField.Element // Exclude element field's parent element
            && element.ParentFieldSet.length === 0); // and elements that are already selected
      }

      this.isEditingChanged.emit(value ? true : false);
    }
  }

  get elementFilter(): Element {
    return this.fields.elementFilter;
  }
  set elementFilter(value: Element) {
    if (this.fields.elementFilter !== value) {
      this.fields.elementFilter = value;

      this.elementFieldDataSource.data = value ? value.ElementFieldSet : [];
    }
  }

  private fields: {
    selectedElementField: ElementField,
    elementFilter: Element,
  } = {
      selectedElementField: null,
      elementFilter: null,
    }

  get isBusy(): boolean {
    return this.projectService.isBusy;
  }

  constructor(private projectService: ProjectService) { }

  addElementField(): void {
    this.selectedElementField = this.projectService.createElementField({
      Element: this.elementFilter,
      Name: "New field",
      DataType: ElementFieldDataType.String,
      SortOrder: this.elementFilter.ElementFieldSet.length + 1,
    });
  }

  cancelElementField(): void {
    var elementField = this.selectedElementField;
    this.selectedElementField = null;
    this.projectService.rejectChangesElementField(elementField);
  }

  editElementField(elementField: ElementField): void {
    this.selectedElementField = elementField;
  }

  ngOnInit(): void {
    this.elementFilter = this.project.ElementSet[0];
  }

  removeElementField(elementField: ElementField): void {

    this.elementFieldDataSource.data = null;
    this.projectService.removeElementField(elementField);
    this.projectService.saveChanges().pipe(
      finalize(() => {
        this.elementFieldDataSource.data = this.elementFilter.ElementFieldSet;
      })).subscribe();
  }

  saveElementField(): void {
    this.projectService.saveElementField(this.selectedElementField)
      .subscribe(() => {
        this.selectedElementField = null;
      });
  }

  submitDisabled(): boolean {

    var hasValidationErrors = this.selectedElementField.entityAspect.getValidationErrors().length > 0
      || (this.selectedElementField.DataType === ElementFieldDataType.Element && !this.selectedElementField.SelectedElement);

    return this.isBusy || hasValidationErrors;
  }

  trackBy(index: number, elementField: ElementField) {
    return elementField.Id;
  }
}
