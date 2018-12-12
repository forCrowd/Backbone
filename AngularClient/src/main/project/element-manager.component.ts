import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
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

  elementDataSource = new MatTableDataSource<Element>([]);
  selection = new SelectionModel<Element>(true, []);
  elementDisplayedColumns = ["select", "name", "sortOrder", "createdOn"];
  sortOrderArray: number[] = null;

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

/*   get sortOrder(): number[] {
    var sortOrderArray = Array(this.selectedElement.SortOrder + 1).fill(1).map((e, i)=>i).reverse();

    if(this.sortOrderArray === null) {
      this.sortOrderArray = sortOrderArray;
      return sortOrderArray;
    }

    return sortOrderArray.length > this.sortOrderArray.length ? sortOrderArray
      : this.sortOrderArray;
  } */

  constructor(private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {
    }

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

  drop(event: CdkDragDrop<Element[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.project.ElementSet[event.previousIndex].SortOrder = this.project.ElementSet.length - (event.currentIndex + 1);
      if (event.previousIndex > event.currentIndex) {
        for (var i = event.currentIndex; i < event.previousIndex; i++) {
          this.project.ElementSet[i].SortOrder = this.project.ElementSet.length - i - 2;
        }
      } else {
        for(var i = event.previousIndex; i < event.currentIndex; i++) {
          this.project.ElementSet[i + 1].SortOrder = this.project.ElementSet.length - i - 1;
        }
      }

      moveItemInArray(this.project.ElementSet, event.previousIndex, event.currentIndex);
      this.saveElement();
      this.elementDataSource.data = this.project.ElementSet;
    }
  }

  ngOnInit(): void {
    this.elementDataSource.data = this.project.ElementSet.sort((a, b)=> b.SortOrder - a.SortOrder);
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
            this.elementDataSource.data = this.project.ElementSet;
            this.selection.clear();
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
    return element.SortOrder;
  }
}
