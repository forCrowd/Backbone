import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Element, Project, ProjectService } from "@forcrowd/backbone-client-core";
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

  elementDataSource = new MatTableDataSource<Element>([]);
  selection = new SelectionModel<Element>(true, []);
  elementDisplayedColumns = ["select", "name", "sortOrder", "createdOn"];

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
    private dialog: MatDialog) { }

  addElement(): void {
    this.selectedElement = this.projectService.createElement({
      Project: this.project,
      Name: "New element",
      SortOrder: this.project.ElementSet.length + 1,
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
    if (!this.projectOwner) this.elementDisplayedColumns.splice(0, 1);
  }

  removeElement(): void {
    const dialogRef = this.dialog.open(RemoveConfirmComponent);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      if (this.selection.selected.length > 0) {

        this.selection.selected.forEach(element => {
          this.projectService.removeElement(element);
        });

        this.projectService.saveChanges().pipe(
          finalize(() => {
            this.elementDataSource.data = this.project.ElementSet;
          })).subscribe();
        }
    });
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
    const numRows = this.elementDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.elementDataSource.data.forEach(row => this.selection.select(row));
  }

  trackBy(index: number, element: Element) {
    return element.Id;
  }
}
