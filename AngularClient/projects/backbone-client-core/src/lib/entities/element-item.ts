import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";

export class ElementItem extends EntityBase {

  // Server-side
  Id = 0;
  Element: Element;
  Name = "";
  ElementCellSet: ElementCell[];
  ParentCellSet: ElementCell[];

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Cells
    this.ElementCellSet.forEach(cell => {
      cell.initialize();
    });
  }
}
