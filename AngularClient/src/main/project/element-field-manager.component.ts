import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Element, ElementField, ElementFieldDataType, Project, ProjectService } from "@forcrowd/backbone-client-core";
import { finalize } from "rxjs/operators";

import { RemoveConfirmComponent } from "./remove-confirm.component";
import { async } from 'q';

@Component({
  selector: "element-field-manager",
  templateUrl: "element-field-manager.component.html",
  styleUrls: ["element-field-manager.component.css"]
})
export class ElementFieldManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Input() projectOwner: boolean = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();

  elementFieldDataSource = new MatTableDataSource<ElementField>([]);
  selection = new SelectionModel<ElementField>(true, []);
  elementFieldDisplayedColumns = ["select", "element", "name", "dataType", "createdOn"];
  elementFieldDataType = ElementFieldDataType;
  selectedElementList: Element[] = [];
  sortOrderArray: number[] = null;

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
      this.elementFieldDataSource.data = this.elementFieldDataSource.data.sort((a, b) => (b.SortOrder - a.SortOrder));
    }
  }

  get sortOrder(): number[] {
    var sortOrderArray = Array(this.selectedElementField.SortOrder + 1).fill(1).map((e, i)=>i).reverse();

    if(this.sortOrderArray === null) {
      this.sortOrderArray = sortOrderArray;
      return sortOrderArray;
    }

    return sortOrderArray.length > this.sortOrderArray.length ? sortOrderArray
      : this.sortOrderArray;
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

  constructor(private projectService: ProjectService,
    private dialog: MatDialog) { }

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

  drop(event: CdkDragDrop<ElementField[]>) {

    var elementFieldSet = this.elementFilter.ElementFieldSet;

    if (event.previousIndex !== event.currentIndex) {
      elementFieldSet[event.previousIndex].SortOrder = elementFieldSet.length - (event.currentIndex + 1);
      if (event.previousIndex > event.currentIndex) {
        for (var i = event.currentIndex; i < event.previousIndex; i++)  {
          elementFieldSet[i].SortOrder = elementFieldSet.length - i - 2;
        }
      } else {
        for (var i = event.previousIndex; i < event.currentIndex; i++) {
          elementFieldSet[i + 1].SortOrder = elementFieldSet.length - i - 1;
        }
      }

      moveItemInArray(elementFieldSet, event.previousIndex, event.currentIndex);
      this.projectService.saveChanges().subscribe();
      this.elementFieldDataSource.data = elementFieldSet;
    }

  }

  ngOnInit(): void {
    this.elementFilter = this.project.ElementSet[0];
    if (!this.projectOwner) this.elementFieldDisplayedColumns.splice(0, 1);
  }

  removeElementField(): void {
    const dialogRef = this.dialog.open(RemoveConfirmComponent);
    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {
        this.selection.selected.forEach(elementField => {
          this.projectService.removeElementField(elementField);
        });
        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.elementFieldDataSource.data = this.elementFilter.ElementFieldSet;
            this.selection.clear();
          })).subscribe();
      }
    });
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.elementFieldDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.elementFieldDataSource.data.forEach(row => this.selection.select(row));
  }

  trackBy(index: number, elementField: ElementField) {
    return elementField.SortOrder;
  }
}
