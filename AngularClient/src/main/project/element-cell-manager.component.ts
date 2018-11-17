import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Element, Project, ElementCell, ElementField, ElementFieldDataType, ElementItem, UserElementCell } from
  "backbone-client-core";

import { ProjectService } from "../core/core.module";

@Component({
  selector: "element-cell-manager",
  templateUrl: "element-cell-manager.component.html",
  styleUrls: ["element-cell-manager.component.css"]
})
export class ElementCellManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();

  elementCellDataSource = new MatTableDataSource<ElementCell>([]);
  elementCellDisplayedColumns = ["elementItem", "value", "createdOn"];
  elementFieldDataType = ElementFieldDataType;

  get elementFilter(): Element {
    return this.fields.elementFilter;
  }
  set elementFilter(value: Element) {
    if (this.fields.elementFilter !== value) {
      this.fields.elementFilter = value;

      this.elementFieldFilter = value ? value.ElementFieldSet[0] : null;
    }
  }

  get elementFieldFilter(): ElementField {
    return this.fields.elementFieldFilter;
  }
  set elementFieldFilter(value: ElementField) {
    if (this.fields.elementFieldFilter !== value) {
      this.fields.elementFieldFilter = value;

      this.elementCellDataSource.data = value ? value.ElementCellSet : [];
    }
  }

  get selectedElementCell(): ElementCell {
    return this.fields.selectedElementCell;
  }
  set selectedElementCell(value: ElementCell) {
    if (this.fields.selectedElementCell !== value) {
      this.fields.selectedElementCell = value;

      this.isEditingChanged.emit(value ? true : false);
    }
  }

  get selectedElementDecimalValue(): number | null {

    if (!this.selectedElementCell || !this.selectedElementCell.UserElementCellSet[0])
      return null;

    return this.selectedElementCell.UserElementCellSet[0].DecimalValue;
  }
  set selectedElementDecimalValue(value) {

    if (!this.selectedElementCell)
      return;

    // If there is no userElementCell, create it
    if (!this.selectedElementCell.UserElementCellSet[0])
      this.projectService.createUserElementCell(this.selectedElementCell, value);

    this.selectedElementCell.UserElementCellSet[0].DecimalValue = value;
  }

  private fields: {
    elementItem: ElementItem,
    elementFilter: Element,
    elementFieldFilter: ElementField,
    selectedElementCell: ElementCell,
  } = {
      elementItem: null,
      elementFilter: null,
      elementFieldFilter: null,
      selectedElementCell: null,
    }

  get isBusy(): boolean {
    return this.projectService.isBusy;
  }

  constructor(private projectService: ProjectService) { }

  cancelElementCell() {
    this.projectService.rejectChangesElementCell(this.selectedElementCell);
    this.selectedElementCell = null;
  }

  editElementCell(elementCell: ElementCell) {
    this.selectedElementCell = elementCell;
  }

  ngOnInit(): void {
    this.elementFilter = this.project.ElementSet[0];
  }

  saveElementCell() {
    this.projectService.saveChanges()
      .subscribe(() => {
        this.selectedElementCell = null;
      });
  }

  submitDisabled(): boolean {
    return this.isBusy || this.selectedElementCell.entityAspect.getValidationErrors().length > 0;
  }

  trackBy(index: number, elementCell: ElementCell) {
    return elementCell.Id;
  }
}
