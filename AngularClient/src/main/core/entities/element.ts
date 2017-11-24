import { EntityBase } from "./entity-base";
import { Project } from "./project";
import { ElementField, ElementFieldDataType } from "./element-field";
import { ElementItem } from "./element-item";

export class Element extends EntityBase {

    // Public - Server-side
    Id: number = 0;
    Project: Project;
    Name: string = "";
    ElementFieldSet: ElementField[];
    ElementItemSet: ElementItem[];
    ParentFieldSet: ElementField[];

    private fields: {
        parent: Element,
        familyTree: Element[],
        rating: number,
    } = {
        parent: null,
        familyTree: null,
        rating: 0,
    };

    elementFieldSet(ratingEnabledFilter: boolean = true): ElementField[] {
        return this.getElementFieldSet(this, ratingEnabledFilter);
    }

    familyTree() {

        // TODO In case of add / remove elements?
        if (this.fields.familyTree === null) {
            this.setFamilyTree();
        }

        return this.fields.familyTree;
    }

    getElementFieldSetSorted(): ElementField[] {
        return this.ElementFieldSet.sort((a, b) => a.SortOrder - b.SortOrder);
    }

    getElementItemSet(sort: string = "name"): ElementItem[] {

        return this.ElementItemSet.sort((a, b) => {

            switch (sort) {
                case "name": {
                    const nameA = a.Name.toLowerCase();
                    const nameB = b.Name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                }
            }
        });
    }

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

    parent() {

        // TODO In case of add / remove elements?
        if (this.fields.parent === null) {
            this.setParent();
        }

        return this.fields.parent;
    }

    rejectChanges(): void {
        this.entityAspect.rejectChanges();
    }

    remove() {

        // Related items
        const elementItemSet = this.ElementItemSet.slice();
        elementItemSet.forEach(elementItem => {
            elementItem.remove();
        });

        // Related fields
        const elementFieldSet = this.ElementFieldSet.slice();
        elementFieldSet.forEach(elementField => {
            elementField.remove();
        });

        this.entityAspect.setDeleted();
    }

    setFamilyTree() {

        this.fields.familyTree = [];

        let element = this as Element; // TODO: ?
        while (element) {
            this.fields.familyTree.unshift(element);
            element = element.parent();
        }

        // TODO At the moment it's only upwards, later include children?
    }

    setRating() {

        const fieldSet = this.elementFieldSet(false);

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

    setParent() {
        if (this.ParentFieldSet.length > 0) {
            this.fields.parent = this.ParentFieldSet[0].Element;
        }
    }

    private getElementFieldSet(element: Element, ratingEnabledFilter: boolean = true) {

        const sortedElementFieldSet = element.getElementFieldSetSorted();
        var fieldSet: ElementField[] = [];

        // Validate
        sortedElementFieldSet.forEach(field => {
            if (!ratingEnabledFilter || (ratingEnabledFilter && field.RatingEnabled)) {
                fieldSet.push(field);
            }

            if (field.DataType === ElementFieldDataType.Element && field.SelectedElement !== null) {
                const childIndexSet = this.getElementFieldSet(field.SelectedElement, ratingEnabledFilter);

                childIndexSet.forEach(childIndex => {
                    fieldSet.push(childIndex);
                });
            }
        });

        return fieldSet;
    }
}
