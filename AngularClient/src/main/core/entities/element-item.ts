import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { ElementFieldDataType } from "./element-field";

export class ElementItem extends EntityBase {

  // Server-side
  Id = 0;
  Element: Element;
  ElementCellSet: ElementCell[];
  ParentCellSet: ElementCell[];

  get Name(): string {
    return this.fields.name;
  }
  set Name(value: string) {
    this.fields.name = value.trim();
  }

  private fields: {
    name: string,
  } = {
      name: "",
    };

  initialize(): void {
    if (this.initialized) return;

    super.initialize();

    // Cells
    this.ElementCellSet.forEach(cell => {
      cell.initialize();
    });
  }
}
