import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog, MatTable } from "@angular/material";
import { Element, ElementItem, Project, ProjectService, NotificationService } from "@forcrowd/backbone-client-core";
import { finalize } from "rxjs/operators";

import { RemoveConfirmComponent } from "./remove-confirm.component";

@Component({
  selector: "element-item-manager",
  templateUrl: "element-item-manager.component.html",
  styleUrls: ["element-item-manager.component.css"]
})
export class ElementItemManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Input() projectOwner: boolean = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();
  @ViewChild(MatTable, {static: false}) matTable: MatTable<any>;

  selection = new SelectionModel<ElementItem>(true, []);
  elementItemDisplayedColumns = ["select", "element", "name", "createdOn"];

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

  constructor(private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog) { }

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
    if (!this.projectOwner) this.elementItemDisplayedColumns.splice(0, 1);
  }

  removeElementItem() {
    var isRemove = true;
    const dialogRef = this.dialog.open(RemoveConfirmComponent);
    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {
        this.selection.selected.forEach(elementItem => {

          if (elementItem.ParentCellSet.length > 0) {
            isRemove = false;
            let parentItem = elementItem.ParentCellSet[0].ElementItem.Name;
            let parentField = elementItem.ParentCellSet[0].ElementField.Name;
            let errorMsg = `This Items (${elementItem.Name}) could not be removed, because firstly related elements (${parentItem}, ${parentField}) must be removed!`;
            this.notificationService.notification.next(errorMsg);
          }

          if (isRemove) this.projectService.removeElementItem(elementItem);
        });

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.matTable.renderRows();
            this.selection.clear();
          })).subscribe();
      }
    });
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

  isAllSelected() {
    if (!this.elementFilter)
      return false;

    const numSelected = this.selection.selected.length;
    const numRows = this.elementFilter.ElementItemSet.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (!this.elementFilter)
      return;

    this.isAllSelected()
      ? this.selection.clear()
      : this.elementFilter.ElementItemSet.forEach(row => this.selection.select(row));
  }

  trackBy(index: number, elementItem: ElementItem) {
    return elementItem.Id;
  }
}
