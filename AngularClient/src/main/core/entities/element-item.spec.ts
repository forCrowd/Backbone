import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/core/entities/element-item", () => {

    it("elementCellIndexSet", () => {

        // Item
        var item1 = TestHelpers.createElementItem();

        // Should have no elements
        expect(item1.elementCellIndexSet().length).toBe(0);

        // Field 1
        var field1 = TestHelpers.createElementField(item1.Element);
        field1.RatingEnabled = false;

        // Cell 1
        TestHelpers.createElementCell(field1, item1);

        // Still...
        expect(item1.elementCellIndexSet().length).toBe(0);

        // Field 2
        var field2 = TestHelpers.createElementField(item1.Element, ElementFieldDataType.Decimal);

        // Cell 2
        TestHelpers.createElementCell(field2, item1);

        // And now 1 item
        expect(item1.elementCellIndexSet().length).toBe(1);
    });
});
