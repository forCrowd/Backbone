import { Subject } from "rxjs";

import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";
import { RatingMode } from "./project";
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

    // Events
    decimalValueUpdated = new Subject<number>();

    // Client-side
    private fields: {
        currentUserDecimalValue: number,
        decimalValue: number,
        decimalValuePercentage: number,
        stringValue: string,
    } = {
        currentUserDecimalValue: 0,
        decimalValue: 0,
        decimalValuePercentage: 0,
        stringValue: null,
    };

    currentUserDecimalValue() {
        return this.fields.currentUserDecimalValue;
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

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

        // Initial values
        this.setCurrentUserDecimalValue();

        // Event handlers
        this.ElementField.Element.Project.ratingModeUpdated.subscribe(() => {
            this.setDecimalValue();
        });

        return true;
    }

    decimalValue() { // a.k.a rating
        return this.fields.decimalValue;
    }

    decimalValueAverage() { // a.k.a. all users' decimal value
        return this.decimalValueCount() === 0 ? 0 : this.decimalValueTotal() / this.decimalValueCount();
    }

    decimalValueCount() {
        return this.ElementField.UseFixedValue
            ? 1
            : this.otherUsersDecimalValueCount + 1; // There is always default value, increase count by 1
    }

    decimalValuePercentage() { // a.k.a. rating percentage
        return this.fields.decimalValuePercentage;
    }

    decimalValueTotal() {
        return this.ElementField.UseFixedValue
            ? this.UserElementCellSet[0]
                ? this.currentUserDecimalValue()
                : this.otherUsersDecimalValueTotal
            : this.otherUsersDecimalValueTotal + this.currentUserDecimalValue();
    }

    setCurrentUserDecimalValue() {

        const value = this.UserElementCellSet[0] ? this.UserElementCellSet[0].DecimalValue : 50; // Default value

        if (this.fields.currentUserDecimalValue !== value) {
            this.fields.currentUserDecimalValue = value;

            this.setDecimalValue();
        }
    }

    setDecimalValue() {

        let value: number;

        switch (this.ElementField.Element.Project.RatingMode) {
            case RatingMode.CurrentUser:
                {
                    value = this.currentUserDecimalValue();
                    break;
                }
            case RatingMode.AllUsers:
                {
                    value = this.decimalValueAverage();
                    break;
                }
        }

        if (this.fields.decimalValue !== value) {
            this.fields.decimalValue = value;

            // Update related
            //this.setDecimalValuePercentage(); - No need to call this one since field is going to update it anyway! / coni2k - 05 Nov. '17
            this.ElementField.setDecimalValue();

            // Event
            this.decimalValueUpdated.next(this.fields.decimalValue);
        }
    }

    setDecimalValuePercentage() {

        const value = this.ElementField.decimalValue() === 0 ? 0 : this.decimalValue() / this.ElementField.decimalValue();

        if (this.fields.decimalValuePercentage !== value) {
            this.fields.decimalValuePercentage = value;
        }
    }
}
