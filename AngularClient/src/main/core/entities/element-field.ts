import { Subject } from "rxjs";

import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { RatingMode } from "./project";
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
    Id: number = 0;
    Element: Element;
    Name: string = "";

    get DataType(): ElementFieldDataType {
        return this.fields.dataType;
    }
    set DataType(value: ElementFieldDataType) {
        if (this.fields.dataType !== value) {
            this.fields.dataType = value;

            if (this.initialized) {

                // a. UseFixedValue must be "true" for String & Element types
                if (value === ElementFieldDataType.String
                    || value === ElementFieldDataType.Element) {
                    this.UseFixedValue = true;
                }

                // b. RatingEnabled must be "false" for String & Element types
                if (value === ElementFieldDataType.String
                    || ElementFieldDataType.Element) {
                    this.RatingEnabled = false;
                }

                // Event
                this.dataTypeChanged.next(this);
            }
        }
    }

    SelectedElement: Element;
    UseFixedValue = false;

    get RatingEnabled(): boolean {
        return this.fields.ratingEnabled;
    }
    set RatingEnabled(value: boolean) {
        if (this.fields.ratingEnabled !== value) {
            this.fields.ratingEnabled = value;

            if (this.initialized) {
                this.ratingEnabledChanged.next(this);
            }
        }
    }
    SortOrder: number = 0;
    RatingTotal: number = 0;
    RatingCount: number = 0;
    ElementCellSet: ElementCell[];
    UserElementFieldSet: UserElementField[];

    // Client-side
    get DataTypeText(): string {

        let text = ElementFieldDataType[this.DataType];

        if (this.DataType === ElementFieldDataType.Element) {
            text += ` (${this.SelectedElement.Name})`;
        }

        return text;
    }
    otherUsersRatingTotal = 0;
    otherUsersRatingCount = 0;

    // Events
    dataTypeChanged = new Subject<ElementField>();
    ratingEnabledChanged = new Subject<ElementField>();
    ratingUpdated = new Subject<number>();

    private fields: {
        currentUserRating: number,
        dataType: ElementFieldDataType,
        decimalValue: number,
        ratingEnabled: boolean,
        rating: number,
        ratingPercentage: number,
    } = {
        currentUserRating: 0,
        dataType: ElementFieldDataType.String,
        decimalValue: 0,
        ratingEnabled: false,
        rating: 0,
        ratingPercentage: 0,
    };

    currentUserRating() {
        return this.fields.currentUserRating;
    }

    rating() {
        return this.fields.rating;
    }

    ratingAverage() { // a.k.a allUsersRating
        return this.ratingCount() === 0 ?
            0 :
            this.ratingTotal() / this.ratingCount();
    }

    ratingCount() {
        return this.otherUsersRatingCount + 1; // There is always default value, increase count by 1
    }

    ratingPercentage() {
        return this.fields.ratingPercentage;
    }

    ratingTotal() {
        return this.otherUsersRatingTotal + this.currentUserRating();
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

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

        // Initial values
        this.setCurrentUserRating();

        // Event handlers
        this.Element.Project.ratingModeUpdated.subscribe(() => {
            this.setRating();
        });

        return true;
    }

    decimalValue() {
        return this.fields.decimalValue;
    }

    rejectChanges(): void {

        const element = this.Element;

        // Related cells
        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {
            elementCell.rejectChanges();
        });

        // Related user element fields
        if (this.UserElementFieldSet[0]) {
            this.UserElementFieldSet[0].entityAspect.rejectChanges();
        }

        this.entityAspect.rejectChanges();

        // Update related
        element.setRating();
    }

    remove() {

        const element = this.Element;

        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {

            // User element cell
            if (elementCell.UserElementCellSet[0]) {
                elementCell.UserElementCellSet[0].entityAspect.setDeleted();
            }

            // Cell
            elementCell.entityAspect.setDeleted();
        });

        // User element field
        if (this.UserElementFieldSet[0]) {
            this.UserElementFieldSet[0].entityAspect.setDeleted();
        }

        this.entityAspect.setDeleted();

        // Update related
        element.setRating();
    }

    setCurrentUserRating() {

        const value = this.UserElementFieldSet[0]
            ? this.UserElementFieldSet[0].Rating
            : this.RatingEnabled
                ? 50 // Default value for RatingEnabled
                : 0; // Otherwise 0

        if (this.fields.currentUserRating !== value) {
            this.fields.currentUserRating = value;

            // Update related
            this.setRating();
        }
    }

    setRating() {

        let value = 0; // Default value

        switch (this.Element.Project.RatingMode) {
            case RatingMode.CurrentUser: { value = this.currentUserRating(); break; }
            case RatingMode.AllUsers: { value = this.ratingAverage(); break; }
        }

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            // Update related
            //this.ratingPercentage(); - No need to call this one since element is going to update it anyway! / coni2k - 05 Nov. '17 
            this.Element.Project.ElementSet[0].setRating();

            this.ratingUpdated.next(this.fields.rating);
        }
    }

    setRatingPercentage() {

        const elementRating = this.Element.Project.ElementSet[0].rating();

        const value = elementRating === 0 ? 0 : this.rating() / elementRating;

        if (this.fields.ratingPercentage !== value) {
            this.fields.ratingPercentage = value;
        }
    }

    setDecimalValue() {

        var value = 0;

        this.ElementCellSet.forEach(cell => {
            value += cell.decimalValue();
        });

        if (this.fields.decimalValue !== value) {
            this.fields.decimalValue = value;

            // Update related
            this.ElementCellSet.forEach(cell => {
                cell.setDecimalValuePercentage();
            });
        }
    }
}
