import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Element, ElementItem, Project, ProjectService } from "@forcrowd/backbone-client-core";
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

  elementItemDataSource = new MatTableDataSource<ElementItem>([]);
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

  constructor(private projectService: ProjectService,
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
    const dialogRef = this.dialog.open(RemoveConfirmComponent);
    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {
        this.selection.selected.forEach(elementItem => {
          this.projectService.removeElementItem(elementItem);
        });

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.elementItemDataSource.data = this.elementFilter.ElementItemSet;
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
    const numSelected = this.selection.selected.length;
    const numRows = this.elementItemDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.elementItemDataSource.data.forEach(row => this.selection.select(row));
  }

  trackBy(index: number, elementItem: ElementItem) {
    return elementItem.Id;
  }
}
