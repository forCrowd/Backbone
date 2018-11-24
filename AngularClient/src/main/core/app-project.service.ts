import { Injectable } from "@angular/core";
import { Element, ElementField, ElementFieldDataType, ElementItem, ProjectService } from "backbone-client-core";

import { settings } from "../../settings/settings";

@Injectable()
export class AppProjectService extends ProjectService {

  createProjectTodo() {

    // Project
    const project = super.createProjectEmpty();
    project.Name = "Todo App";
    project.Origin = settings.todoAppOrigin;

    // Element
    const element = super.createElement({
      Project: project,
      Name: "Main"
    }) as Element;

    // Field
    const elementField = super.createElementField({
      Element: element,
      Name: "Completed",
      DataType: ElementFieldDataType.Decimal,
      UseFixedValue: false,
      RatingEnabled: false,
      SortOrder: 1
    }) as ElementField;

    // Item 1
    const elementItem1 = super.createElementItem({
      Element: element,
      Name: "Create a project on Backbone"
    }) as ElementItem;

    // Cell 1
    const cell1 = super.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem1
    });

    // User cell 1
    super.createUserElementCell(cell1, 1);

    // Item 2
    const elementItem2 = super.createElementItem({
      Element: element,
      Name: "Read 'The Little Prince' book"
    });

    // Cell 2
    const cell2 = super.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem2
    });

    // User cell 2
    super.createUserElementCell(cell2, 0);

    // Item 3
    const elementItem3 = super.createElementItem({
      Element: element,
      Name: "Watch 'Shawshank Redemption' movie"
    });

    // Cell 3
    const cell3 = super.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem3
    });

    // User cell 3
    super.createUserElementCell(cell3, 0);

    // Item 4
    const elementItem4 = super.createElementItem({
      Element: element,
      Name: "Visit 'Niagara Falls'"
    });

    // Cell 4
    const cell4 = super.createElementCell({
      ElementField: elementField,
      ElementItem: elementItem4
    });

    // User cell 4
    super.createUserElementCell(cell4, 0);

    return project;
  }
}
