import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { UserElementField } from "./user-element-field";

export enum ElementFieldDataType {

  // A field that holds string value.
  // Use StringValue property to set its value on ElementItem level.
  String = 1,

  // A field that holds decimal value.
  // Use DecimalValue property to set its value on ElementItem level.
  Decimal = 4,

  // A field that holds another defined Element object within the project.
  // Use SelectedElementItem property to set its value on ElementItem level.
  Element = 6,
}

export class ElementField extends EntityBase {

  // Server-side
  Id = 0;
  Element: Element;
  Name = "";
  DataType = ElementFieldDataType.String;
  SelectedElement: Element;
  UseFixedValue = false;
  RatingEnabled = false;
  SortOrder = 0;
  RatingTotal = 0;
  RatingCount = 0;
  ElementCellSet: ElementCell[];
  UserElementFieldSet: UserElementField[];

  // Client-side
  get DataTypeText() {

    let text = ElementFieldDataType[this.DataType];

    if (this.DataType === ElementFieldDataType.Element && this.SelectedElement) {
      text += ` - ${this.SelectedElement.Name}`;
    }

    return text;
  }

  otherUsersRatingTotal = 0;
  otherUsersRatingCount = 0;

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Cells
    this.ElementCellSet.forEach(cell => {
      cell.initialize();
    });

    // Other users'
    this.otherUsersRatingTotal = this.RatingTotal;
    this.otherUsersRatingCount = this.RatingCount;

    // Exclude current user's
    if (this.UserElementFieldSet[0]) {
      this.otherUsersRatingTotal -= this.UserElementFieldSet[0].Rating;
      this.otherUsersRatingCount -= 1;
    }

    // User fields
    this.UserElementFieldSet.forEach(userField => {
      userField.initialize();
    });
  }
}
