import { EntityBase } from "./entity-base";
import { Project } from "./project";
import { ElementField, ElementFieldDataType } from "./element-field";
import { ElementItem } from "./element-item";

export class Element extends EntityBase {

  // Public - Server-side
  Id = 0;
  Project: Project;
  Name = "";
  SortOrder = 0;
  ElementFieldSet: ElementField[];
  ElementItemSet: ElementItem[];
  ParentFieldSet: ElementField[];

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Fields
    this.ElementFieldSet.forEach(field => {
      field.initialize();
    });

    // Items
    this.ElementItemSet.forEach(item => {
      item.initialize();
    });
  }

  private getElementFieldSet(element: Element) {

    var fieldSet: ElementField[] = [];

    element.ElementFieldSet.forEach(field => {

      fieldSet.push(field);

      if (field.DataType === ElementFieldDataType.Element && field.SelectedElement !== null) {
        const childFieldSet = this.getElementFieldSet(field.SelectedElement);

        childFieldSet.forEach(childField => {
          fieldSet.push(childField);
        });
      }
    });

    return fieldSet;
  }
}
