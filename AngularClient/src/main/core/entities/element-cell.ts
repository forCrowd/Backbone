import { Subject } from "rxjs";

import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";
import { RatingMode } from "./project";
import { UserElementCell } from "./user-element-cell";

export class ElementCell extends EntityBase {

    // Public - Server-side
    Id: number = 0;
    ElementField: ElementField;
    ElementItem: ElementItem;
    StringValue: string = "";
    NumericValueTotal: number = 0;
    NumericValueCount: number = 0;
    SelectedElementItem: ElementItem;
    UserElementCellSet: UserElementCell[];

    numericValueUpdated = new Subject<number>();

    // Client-side
    private fields: {
        currentUserNumericValue: number,
        numericValue: number,
        numericValuePercentage: number,
    } = {
        currentUserNumericValue: 0,
        numericValue: 0,
        numericValuePercentage: 0,
    };

    otherUsersNumericValueTotal = 0;
    otherUsersNumericValueCount = 0;

    currentUserNumericValue() {
        return this.fields.currentUserNumericValue;
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Other users'
        this.otherUsersNumericValueTotal = this.NumericValueTotal;
        this.otherUsersNumericValueCount = this.NumericValueCount;

        // Exclude current user's
        if (this.UserElementCellSet[0]) {
            this.otherUsersNumericValueTotal -= this.UserElementCellSet[0].DecimalValue;
            this.otherUsersNumericValueCount -= 1;
        }

        // User cells
        this.UserElementCellSet.forEach(userCell => {
            userCell.initialize();
        });

        // Initial values
        this.setCurrentUserNumericValue();

        // Event handlers
        this.ElementField.Element.Project.ratingModeUpdated.subscribe(() => {
            this.setNumericValue();
        });

        return true;
    }

    numericValue() { // a.k.a rating
        return this.fields.numericValue;
    }

    numericValueAverage() { // a.k.a. allUsersNumericValue
        return this.numericValueCount() === 0 ? 0 : this.numericValueTotal() / this.numericValueCount();
    }

    numericValueCount() {
        return this.ElementField.UseFixedValue
            ? 1
            : this.otherUsersNumericValueCount + 1; // There is always default value, increase count by 1
    }

    numericValuePercentage() { // a.k.a. ratingPercentage
        return this.fields.numericValuePercentage;
    }

    numericValueTotal() {
        return this.ElementField.UseFixedValue
            ? this.UserElementCellSet[0]
                ? this.currentUserNumericValue()
                : this.otherUsersNumericValueTotal
            : this.otherUsersNumericValueTotal + this.currentUserNumericValue();
    }

    rejectChanges(): void {

        if (this.UserElementCellSet[0]) {
            this.UserElementCellSet[0].entityAspect.rejectChanges();
        }

        this.entityAspect.rejectChanges();
    }

    setCurrentUserNumericValue() {

        const value = this.UserElementCellSet[0] ? this.UserElementCellSet[0].DecimalValue : 50; // Default value

        if (this.fields.currentUserNumericValue !== value) {
            this.fields.currentUserNumericValue = value;

            this.setNumericValue();
        }
    }

    setNumericValue() {

        let value: number;

        switch (this.ElementField.Element.Project.RatingMode) {
            case RatingMode.CurrentUser:
                {
                    value = this.currentUserNumericValue();
                    break;
                }
            case RatingMode.AllUsers:
                {
                    value = this.numericValueAverage();
                    break;
                }
        }

        if (this.fields.numericValue !== value) {
            this.fields.numericValue = value;

            // Update related
            //this.setNumericValuePercentage(); - No need to call this one since field is going to update it anyway! / coni2k - 05 Nov. '17
            this.ElementField.setNumericValue();

            // Event
            this.numericValueUpdated.next(this.fields.numericValue);
        }
    }

    setNumericValuePercentage() {

        const value = this.ElementField.numericValue() === 0 ? 0 : this.numericValue() / this.ElementField.numericValue();

        if (this.fields.numericValuePercentage !== value) {
            this.fields.numericValuePercentage = value;
        }
    }
}
