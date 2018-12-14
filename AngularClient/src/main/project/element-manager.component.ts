import { moveItemInArray } from "@angular/cdk/drag-drop";
import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog, MatTable } from "@angular/material";
import { Element, Project, ProjectService, NotificationService } from "@forcrowd/backbone-client-core";
import { finalize } from "rxjs/operators";

import { RemoveConfirmComponent } from "./remove-confirm.component";

@Component({
  selector: "element-manager",
  templateUrl: "element-manager.component.html",
  styleUrls: ["element-manager.component.css"]
})
export class ElementManagerComponent implements OnInit {

  @Input() project: Project = null;
  @Input() projectOwner: boolean = null;
  @Output() isEditingChanged = new EventEmitter<boolean>();
  @ViewChild(MatTable) matTable: MatTable<any>;

  selection = new SelectionModel<Element>(true, []);
  elementDisplayedColumns = ["select", "name", "createdOn"];

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

  constructor(private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog) { }

  addElement(): void {
    this.selectedElement = this.projectService.createElement({
      Project: this.project,
      Name: "New element",
      SortOrder: this.project.ElementSet.length,
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
    this.project.ElementSet.sort((a, b) => a.SortOrder - b.SortOrder);
    if (!this.projectOwner) this.elementDisplayedColumns.splice(0, 1);
  }

  removeElement(): void {
    var isRemove = true;
    const dialogRef = this.dialog.open(RemoveConfirmComponent);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {
        this.selection.selected.forEach(selected => {

          if (selected.ParentFieldSet.length > 0) {
            isRemove = false;
            let parentField = selected.ParentFieldSet[0].Name;
            let errorMsg = `This Element (${selected.Name}) could not be removed, because firstly related field (${parentField}) must be removed!`;
            this.notificationService.notification.next(errorMsg);
          }

          if(isRemove) this.projectService.removeElement(selected);
        });

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.matTable.renderRows();
            this.selection.clear();
          })).subscribe();
        }
    });
  }

  onListDrop($event) {

    // Update data & render
    const prevIndex = this.project.ElementSet.findIndex(d => d === $event.item.data);
    moveItemInArray(this.project.ElementSet, prevIndex, $event.currentIndex);
    this.matTable.renderRows();

    // Update elements' SortOrder property
    this.project.ElementSet.map((e, i) => {
      if (e.SortOrder !== i) {
        e.SortOrder = i;
      }
    });

    // Save
    this.projectService.saveChanges().subscribe();
  }

  saveElement(): void {
    this.projectService.saveChanges().subscribe(() => {
      this.selectedElement = null;
    });
  }

  submitDisabled(): boolean {
    return this.isBusy || this.selectedElement.entityAspect.getValidationErrors().length > 0;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.project.ElementSet.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.project.ElementSet.forEach(row => this.selection.select(row));
  }

  trackBy(index: number, element: Element) {
    return element.Id;
  }
}
