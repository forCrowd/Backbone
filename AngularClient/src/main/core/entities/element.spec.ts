import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/core/entities/element", () => {

    it("rating", () => {

        // Case 1: Initial
        var element = TestHelpers.createElement();

        expect(element.rating()).toBe(0);

        // Case 2: Adding the first index field
        TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.rating()).toBe(50);

        // Case 2: Adding the second index field
        TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.rating()).toBe(100);

        // TODO Update / remove cases

    });
});
