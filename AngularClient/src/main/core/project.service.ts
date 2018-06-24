import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EntityQuery, Predicate } from "../../libraries/breeze-client";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttpClient } from "./app-http-client/app-http-client.module";
import { Element } from "./entities/element";
import { ElementCell } from "./entities/element-cell";
import { ElementField, ElementFieldDataType } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { Project } from "./entities/project";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { AppEntityManager } from "./app-entity-manager.service";
import { AuthService } from "./auth.service";
import { getUniqueValue } from "../shared/utils";

@Injectable()
export class ProjectService {

  get isBusy(): boolean {
    return this.appEntityManager.isBusy || this.appHttpClient.isBusy || this.isBusyLocal;
  }

  private readonly appHttpClient: AppHttpClient = null;
  private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

  constructor(private appEntityManager: AppEntityManager,
    private authService: AuthService,
    private httpClient: HttpClient) {

    this.appHttpClient = httpClient as AppHttpClient;
  }

  createElement(initialValues: Object) {
    return this.appEntityManager.createEntity("Element", initialValues);
  }

  createElementCell(initialValues: Object) {

    const elementCell = this.appEntityManager.createEntity("ElementCell", initialValues) as ElementCell;

    // If DataType is decimal, also create "User element cell"
    if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {

      elementCell.DecimalValueTotal = 0; // Computed field
      elementCell.DecimalValueCount = 1; // Computed field

      const userElementCellInitial = {
        User: this.authService.currentUser,
        ElementCell: elementCell,
        DecimalValue: 0,
      } as any;

      this.appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
    }

    return elementCell;
  }

  createElementField(initialValues: Object) {

    const elementField = this.appEntityManager.createEntity("ElementField", initialValues) as ElementField;

    // If RatingEnabled, also create "User element field"
    if (elementField.RatingEnabled) {

      elementField.RatingTotal = 0; // Computed field
      elementField.RatingCount = 1; // Computed field

      const userElementFieldInitial = {
        User: this.authService.currentUser,
        ElementField: elementField,
        Rating: 0
      };

      this.appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
    }

    return elementField;
  }

  createElementItem(initialValues: Object): ElementItem {
    return this.appEntityManager.createEntity("ElementItem", initialValues) as ElementItem;
  }

  createProjectEmpty(): Project {

    const project = this.appEntityManager.createEntity("Project", {
      User: this.authService.currentUser
    }) as Project;

    project.Name = `New project ${getUniqueValue()}`;
    project.Origin = "http://";
    project.RatingCount = 1; // Computed field

    return project;
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

  createProjectTodo() {

    // Project
    const project = this.createProjectEmpty();
    project.Name = "Todo App";
    project.Origin = AppSettings.todoAppOrigin;

    // Element
    const element = this.createElement({
      Project: project,
      Name: "Main"
    }) as Element;

    // Field
    const elementField = this.createElementField({
      Element: element,
      Name: "Completed",
      DataType: ElementFieldDataType.Decimal,
      UseFixedValue: false,
      RatingEnabled: false,
      SortOrder: 1
    }) as ElementField;

    // Item 1
    const elementItem1 = this.createElementItem({
      Element: element,
      Name: "Create a project on Backbone"
    }) as ElementItem;

    // Cell 1
    const cell1 = this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem1
    });
    cell1.UserElementCellSet[0].DecimalValue = 1;

    // Item 2
    const elementItem2 = this.createElementItem({
      Element: element,
      Name: "Read 'The Little Prince'"
    });

    // Cell 2
    this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem2
    });

    // Item 3
    const elementItem3 = this.createElementItem({
      Element: element,
      Name: "Watch 'Shawshank Redemption'"
    });

    // Cell 3
    this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem3
    });

    // Item 4
    const elementItem4 = this.createElementItem({
      Element: element,
      Name: "Visit 'Niagara Falls'"
    });

    // Cell 4
    this.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem4
    });

    return project;
  }

  getProjectExpanded(projectId: number, forceRefresh = false) {

    // Prepare the query
    let query = EntityQuery.from("Project").where("Id", "eq", projectId);

    // Is authorized? No, then get only the public data, yes, then get include user's own records
    query = this.authService.currentUser.isAuthenticated()
      ? query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet")
      : query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");

    return this.appEntityManager.executeQueryObservable<Project>(query, forceRefresh)
      .map(response => {
        return response.results[0] || null;
      });
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

    return this.appEntityManager.executeQueryObservable<Project>(query)
      .map(response => {
        return response.results;
      });
  }

  hasChanges(): boolean {
    return this.appEntityManager.hasChanges();
  }

  // Currently not in use
  refreshComputedFields(project: Project): Observable<void> {

    const updateComputedFieldsUrl = this.getUpdateComputedFieldsUrl(project.Id);

    return this.httpClient.post<void>(updateComputedFieldsUrl, null).mergeMap(() => {
      return this.getProjectExpanded(project.Id, true).map(() => { });
    });
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

    const element = elementField.Element;

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

    const element = elementItem.Element;

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
    return this.authService.ensureAuthenticatedUser()
      .mergeMap(() => {
        return this.appEntityManager.saveChangesObservable();
      })
      .finally(() => {
        this.isBusyLocal = false;
      });
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

  updateElementCellDecimalValue(elementCell: ElementCell, value: number) {
    // Todo Implement!
  }

  private getUpdateComputedFieldsUrl(projectId: number) {
    return `${AppSettings.serviceApiUrl}/ProjectApi/${projectId}/UpdateComputedFields`;
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
