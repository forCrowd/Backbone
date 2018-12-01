import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EntityQuery, Predicate } from "breeze-client";
import { Observable } from "rxjs";
import { mergeMap, finalize, map } from "rxjs/operators";

import { AppEntityManager } from "../app-entity-manager/app-entity-manager";
import { AppHttpClient } from "../app-http-client/app-http-client";
import { AuthService } from "../auth/auth-service";
import { ElementCell, ElementField, ElementFieldDataType, ElementItem, Element, Project, UserElementCell } from
  "../entities";
import { Config } from "../config";
import { getUniqueValue } from "../utils";

@Injectable()
export class ProjectService {

  get isBusy(): boolean {
    return this.appEntityManager.isBusy || this.appHttpClient.isBusy || this.isBusyLocal;
  }

  private readonly appHttpClient: AppHttpClient = null;
  private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

  constructor(private appEntityManager: AppEntityManager,
    private authService: AuthService,
    private httpClient: HttpClient,
    private readonly config: Config) {

    this.appHttpClient = httpClient as AppHttpClient;
  }

  createElement(initialValues: {}) {
    return this.appEntityManager.createEntity("Element", initialValues);
  }

  createElementCell(initialValues: {}) {
    return this.appEntityManager.createEntity("ElementCell", initialValues) as ElementCell;
  }

  createUserElementCell(elementCell: ElementCell, decimalValue: number | null) {

    if (elementCell.ElementField.DataType !== ElementFieldDataType.Decimal) {
      throw new Error(`Invalid field type: ${elementCell.ElementField.DataType}`);
    }

    const initialValues = {
      User: this.authService.currentUser,
      ElementCell: elementCell,
      DecimalValue: decimalValue
    };

    return this.appEntityManager.createEntity("UserElementCell", initialValues) as UserElementCell;
  }

  createElementField(initialValues: {}) {
    return this.appEntityManager.createEntity("ElementField", initialValues) as ElementField;
  }

  createElementItem(initialValues: {}): ElementItem {
    return this.appEntityManager.createEntity("ElementItem", initialValues) as ElementItem;
  }

  createProjectBasic() {

    // Project
    const project = this.createProjectEmpty();

    // Element
    const element = this.createElement({
      Project: project,
      Name: "New element"
    }) as Element;

    // Field
    const elementField = this.createElementField({
      Element: element,
      Name: "New field",
      DataType: ElementFieldDataType.Decimal,
      UseFixedValue: false,
      RatingEnabled: true,
      SortOrder: 1
    }) as ElementField;

    // Item 1
    const elementItem1 = this.createElementItem({
      Element: element,
      Name: "New item 1"
    }) as ElementItem;

    // Cell 1
    this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem1
    });

    // Item 2
    const elementItem2 = this.createElementItem({
      Element: element,
      Name: "New item 2"
    });

    // Cell 2
    this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem2
    });

    return project;
  }

  createProjectEmpty(): Project {

    const project = this.appEntityManager.createEntity("Project", {
      User: this.authService.currentUser,
      Name: `New project ${getUniqueValue()}`,
      Origin: "http://",
      RatingCount: 1 // Computed field
    }) as Project;

    return project;
  }

  createProjectParentChild() {

    // Project
    const project = this.createProjectEmpty();
    project.Name = "Parent - Child";

    // Child element
    const childElement = this.createElement({
      Project: project,
      Name: "Child",
      SortOrder: 1
    }) as Element;

    // Child element - Rating field
    const childRatingField = this.createElementField({
      Element: childElement,
      Name: "Rating",
      DataType: ElementFieldDataType.Decimal,
      UseFixedValue: false,
      RatingEnabled: true,
      SortOrder: 1
    }) as ElementField;

    // Child element - Item 1
    const childItem1 = this.createElementItem({
      Element: childElement,
      Name: "Child item 1"
    }) as ElementItem;

    // Child element - Cell 1
    this.createElementCell({
      ElementField: childRatingField,
      ElementItem: childItem1,
    });

    // Child element - Item 2
    const childItem2 = this.createElementItem({
      Element: childElement,
      Name: "Child item 2"
    }) as ElementItem;

    // Child element - Cell 2
    this.createElementCell({
      ElementField: childRatingField,
      ElementItem: childItem2,
    });

    // Parent element
    const parentElement = this.createElement({
      Project: project,
      Name: "Parent",
      SortOrder: 0
    }) as Element;

    // Parent element - Child field
    const parentChildField = this.createElementField({
      Element: parentElement,
      Name: "Child",
      DataType: ElementFieldDataType.Element,
      SelectedElement: childElement
    }) as ElementField;

    // Parent element - Item 1
    const parentItem1 = this.createElementItem({
      Element: parentElement,
      Name: "Parent item 1"
    }) as ElementItem;

    // Parent element - Cell 1
    this.createElementCell({
      ElementField: parentChildField,
      ElementItem: parentItem1,
      SelectedElementItem: childItem1
    });

    // Parent element - Item 2
    const parentItem2 = this.createElementItem({
      Element: parentElement,
      Name: "Parent item 2"
    }) as ElementItem;

    // Parent element - Child 2
    this.createElementCell({
      ElementField: parentChildField,
      ElementItem: parentItem2,
      SelectedElementItem: childItem2
    });

    // Return
    return project;
  }

  //createProjectTodo() {

  //  // Project
  //  const project = this.createProjectEmpty();
  //  project.Name = "Todo App";
  //  //project.Origin = this.settings.todoAppOrigin;
  //  project.Origin = "";

  //  // Element
  //  const element = this.createElement({
  //    Project: project,
  //    Name: "Main"
  //  }) as Element;

  //  // Field
  //  const elementField = this.createElementField({
  //    Element: element,
  //    Name: "Completed",
  //    DataType: ElementFieldDataType.Decimal,
  //    UseFixedValue: false,
  //    RatingEnabled: false,
  //    SortOrder: 1
  //  }) as ElementField;

  //  // Item 1
  //  const elementItem1 = this.createElementItem({
  //    Element: element,
  //    Name: "Create a project on Backbone"
  //  }) as ElementItem;

  //  // Cell 1
  //  const cell1 = this.createElementCell({
  //    ElementField: elementField,
  //    ElementItem: elementItem1
  //  });

  //  // User cell 1
  //  this.createUserElementCell(cell1, 1);

  //  // Item 2
  //  const elementItem2 = this.createElementItem({
  //    Element: element,
  //    Name: "Read 'The Little Prince' book"
  //  });

  //  // Cell 2
  //  const cell2 = this.createElementCell({
  //    ElementField: elementField,
  //    ElementItem: elementItem2
  //  });

  //  // User cell 2
  //  this.createUserElementCell(cell2, 0);

  //  // Item 3
  //  const elementItem3 = this.createElementItem({
  //    Element: element,
  //    Name: "Watch 'Shawshank Redemption' movie"
  //  });

  //  // Cell 3
  //  const cell3 = this.createElementCell({
  //    ElementField: elementField,
  //    ElementItem: elementItem3
  //  });

  //  // User cell 3
  //  this.createUserElementCell(cell3, 0);

  //  // Item 4
  //  const elementItem4 = this.createElementItem({
  //    Element: element,
  //    Name: "Visit 'Niagara Falls'"
  //  });

  //  // Cell 4
  //  const cell4 = this.createElementCell({
  //    ElementField: elementField,
  //    ElementItem: elementItem4
  //  });

  //  // User cell 4
  //  this.createUserElementCell(cell4, 0);

  //  return project;
  //}

  getProjectExpanded(projectId: number, forceRefresh = false) {

    // Prepare the query
    let query = EntityQuery.from("Project").where("Id", "eq", projectId);

    // Is authorized? No, then get only the public data, yes, then get include user's own records
    query = this.authService.currentUser.isAuthenticated()
      ? query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet")
      : query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");

    return this.appEntityManager.executeQueryObservable<Project>(query, forceRefresh).pipe(
      map(response => {
        return response.results[0] || null;
      }));
  }

  getProjectSet(searchKey: string = "") {

    let query = EntityQuery
      .from("Project")
      .expand(["User"])
      .orderBy("Name");

    if (searchKey !== "") {
      const projectNamePredicate = new Predicate("Name", "contains", searchKey);
      const userNamePredicate = new Predicate("User.UserName", "contains", searchKey);
      query = query.where(projectNamePredicate.or(userNamePredicate));
    }

    return this.appEntityManager.executeQueryObservable<Project>(query).pipe(
      map(response => {
        return response.results;
      }));
  }

  hasChanges(): boolean {
    return this.appEntityManager.hasChanges();
  }

  // Currently not in use
  refreshComputedFields(project: Project): Observable<void> {

    const updateComputedFieldsUrl = this.getUpdateComputedFieldsUrl(project.Id);

    return this.httpClient.post<void>(updateComputedFieldsUrl, null).pipe(mergeMap(() => {
      return this.getProjectExpanded(project.Id, true).pipe(map(() => { }));
    }));
  }

  rejectChanges(): void {
    this.appEntityManager.rejectChanges();
  }

  rejectChangesElement(element: Element): void {
    element.entityAspect.rejectChanges();
  }

  rejectChangesElementCell(elementCell: ElementCell): void {

    if (elementCell.UserElementCellSet[0]) {
      elementCell.UserElementCellSet[0].entityAspect.rejectChanges();
    }

    elementCell.entityAspect.rejectChanges();
  }

  rejectChangesElementField(elementField: ElementField): void {
    elementField.entityAspect.rejectChanges();
  }

  rejectChangesElementItem(elementItem: ElementItem): void {
    elementItem.entityAspect.rejectChanges();
  }

  removeElement(element: Element) {

    // Related items
    const elementItemSet = element.ElementItemSet.slice();
    elementItemSet.forEach(elementItem => {
      this.removeElementItem(elementItem);
    });

    // Related fields
    const elementFieldSet = element.ElementFieldSet.slice();
    elementFieldSet.forEach(elementField => {
      this.removeElementField(elementField);
    });

    element.entityAspect.setDeleted();
  }

  removeElementField(elementField: ElementField) {

    const elementCellSet = elementField.ElementCellSet.slice();
    elementCellSet.forEach(elementCell => {
      this.removeElementCell(elementCell);
    });

    // User element field
    if (elementField.UserElementFieldSet[0]) {
      elementField.UserElementFieldSet[0].entityAspect.setDeleted();
    }

    elementField.entityAspect.setDeleted();
  }

  removeElementItem(elementItem: ElementItem) {

    const elementCellSet = elementItem.ElementCellSet.slice();
    elementCellSet.forEach(elementCell => {
      this.removeElementCell(elementCell);
    });

    elementItem.entityAspect.setDeleted();
  }

  removeProject(project: Project) {

    // Related elements
    const elementSet = project.ElementSet.slice();
    elementSet.forEach(element => {
      this.removeElement(element);
    });

    project.entityAspect.setDeleted();
  }

  saveChanges(): Observable<void> {
    this.isBusyLocal = true;
    return this.authService.ensureAuthenticatedUser().pipe(
      mergeMap(() => {
        return this.appEntityManager.saveChangesObservable();
      }),
      finalize(() => {
        this.isBusyLocal = false;
      }));
  }

  // Todo Improve these later on (merge into saveChanges() itself?) / coni2k - 19 Feb. '18
  saveElementField(elementField: ElementField): Observable<void> {

    // Related cells
    if (elementField.ElementCellSet.length === 0) {
      elementField.Element.ElementItemSet.forEach(elementItem => {
        this.createElementCell({
          ElementField: elementField,
          ElementItem: elementItem
        });
      });
    }

    return this.saveChanges();
  }

  // Todo Improve these later on (merge into saveChanges() itself?) / coni2k - 19 Feb. '18
  saveElementItem(elementItem: ElementItem): Observable<void> {

    // Related cells
    if (elementItem.ElementCellSet.length === 0) {
      elementItem.Element.ElementFieldSet.forEach(elementField => {
        this.createElementCell({
          ElementField: elementField,
          ElementItem: elementItem
        });
      });
    }

    return this.saveChanges();
  }

  private getUpdateComputedFieldsUrl(projectId: number) {
    return `${this.config.serviceApiUrl}/ProjectApi/${projectId}/UpdateComputedFields`;
  }

  private removeElementCell(elementCell: ElementCell): void {

    // User element cell
    if (elementCell.UserElementCellSet[0]) {
      elementCell.UserElementCellSet[0].entityAspect.setDeleted();
    }

    // Cell
    elementCell.entityAspect.setDeleted();
  }
}
