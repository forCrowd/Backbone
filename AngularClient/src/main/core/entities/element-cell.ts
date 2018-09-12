import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";
import { UserElementCell } from "./user-element-cell";

export class ElementCell extends EntityBase {

  // Public - Server-side
  Id = 0;
  ElementField: ElementField;
  ElementItem: ElementItem;
  DecimalValueTotal = 0;
  DecimalValueCount = 0;
  SelectedElementItem: ElementItem;
  UserElementCellSet: UserElementCell[];

  get StringValue(): string {
    return this.fields.stringValue;
  }
  set StringValue(value: string) {
    this.fields.stringValue = value ? value.trim() : null;
  }

  // Client
  otherUsersDecimalValueTotal = 0;
  otherUsersDecimalValueCount = 0;

  // Client-side
  private fields: {
    stringValue: string,
  } = {
      stringValue: null,
    };

  initialize(): boolean {
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
