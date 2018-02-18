import { EntityBase } from "./entity-base";
import { Project } from "./project";
import { ElementField, ElementFieldDataType } from "./element-field";
import { ElementItem } from "./element-item";

export class Element extends EntityBase {

    // Public - Server-side
    Id = 0;
    Project: Project;
    ElementFieldSet: ElementField[];
    ElementItemSet: ElementItem[];
    ParentFieldSet: ElementField[];

    get Name(): string {
        return this.fields.name;
    }
    set Name(value: string) {
        this.fields.name = value.trim();
    }

    private fields: {
        name: string,
        rating: number,
    } = {
        name: "",
        rating: 0,
    };

    rating() {
        return this.fields.rating;
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Fields
        this.ElementFieldSet.forEach(field => {
            field.initialize();
        });

        // Items
        this.ElementItemSet.forEach(item => {
            item.initialize();
        });

        return true;
    }

    setRating() {

        const fieldSet = this.getElementFieldSet(this);

        var value = 0;
        fieldSet.forEach(field => {
            value += field.rating();
        });

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            // Update related
            fieldSet.forEach(field => {
                field.setRatingPercentage();
            });
        }
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
