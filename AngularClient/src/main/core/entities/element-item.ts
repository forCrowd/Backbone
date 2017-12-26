import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { ElementFieldDataType } from "./element-field";

export class ElementItem extends EntityBase {

    // Server-side
    Id: number = 0;
    Element: Element;
    Name: string = "";
    ElementCellSet: ElementCell[];
    ParentCellSet: ElementCell[];

    elementCellIndexSet() {
        return this.getElementCellIndexSet(this);
    }

    elementCell(fieldName: string): ElementCell {

        let cell: ElementCell = null;

        for (let elementCellIndex = 0; elementCellIndex < this.ElementCellSet.length; elementCellIndex++) {
            cell = this.ElementCellSet[elementCellIndex];

            if (cell.ElementField.Name === fieldName) {
                break;
            }
        }

        return cell;
    }

    getElementCellSetSorted(): ElementCell[] {
        return this.ElementCellSet.sort((a, b) => (a.ElementField.SortOrder - b.ElementField.SortOrder));
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Cells
        this.ElementCellSet.forEach(cell => {
            cell.initialize();
        });

        return true;
    }

    rejectChanges(): void {

        // Related cells
        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {
            elementCell.rejectChanges();
        });

        this.entityAspect.rejectChanges();
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

        this.entityAspect.setDeleted();

        // Update related
        element.ElementFieldSet.forEach(field => {
            field.setDecimalValue();
        });
    }

    private getElementCellIndexSet(elementItem: ElementItem) {

        var indexSet: ElementCell[] = [];
        const sortedElementCellSet = elementItem.getElementCellSetSorted();

        sortedElementCellSet.forEach(cell => {

            if (cell.ElementField.RatingEnabled) {
                indexSet.push(cell);
            }

            if (cell.ElementField.DataType === ElementFieldDataType.Element && cell.SelectedElementItem !== null) {
                const childIndexSet = this.getElementCellIndexSet(cell.SelectedElementItem);

                if (childIndexSet.length > 0) {
                    indexSet.push(cell);
                }
            }
        });

        return indexSet;
    }
}
