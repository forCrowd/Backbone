import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";
import { UserElementCell } from "./user-element-cell";

export class ElementCell extends EntityBase {

  // Public - Server-side
  Id = 0;
  ElementField: ElementField;
  ElementItem: ElementItem;
  StringValue: string | null = null;
  DecimalValueTotal = 0;
  DecimalValueCount = 0;
  SelectedElementItem: ElementItem;
  UserElementCellSet: UserElementCell[];

  // Client
  otherUsersDecimalValueTotal = 0;
  otherUsersDecimalValueCount = 0;

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Other users'
    this.otherUsersDecimalValueTotal = this.DecimalValueTotal;
    this.otherUsersDecimalValueCount = this.DecimalValueCount;

    // Exclude current user's
    if (this.UserElementCellSet[0]) {
      this.otherUsersDecimalValueTotal -= this.UserElementCellSet[0].DecimalValue;
      this.otherUsersDecimalValueCount -= 1;
    }

    // User cells
    this.UserElementCellSet.forEach(userCell => {
      userCell.initialize();
    });
  }
}
