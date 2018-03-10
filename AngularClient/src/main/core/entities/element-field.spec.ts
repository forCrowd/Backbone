import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

describe("main/core/entities/element-field", () => {

    it("otherUsersRatingTotal & otherUsersRatingCount - Initial", () => {

        var field = TestHelpers.createElementField();

        expect(field.otherUsersRatingTotal).toBe(0);
        expect(field.otherUsersRatingCount).toBe(0);
    });

    it("otherUsersRatingTotal & otherUsersRatingCount - Without user rating", () => {

        var field = TestHelpers.createElementField(null, null, 25, 3);

        expect(field.otherUsersRatingTotal).toBe(25);
        expect(field.otherUsersRatingCount).toBe(3);
    });

    it("otherUsersRatingTotal & otherUsersRatingCount - With user rating", () => {

        var field = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 25, 3, 10);

        expect(field.otherUsersRatingTotal).toBe(15);
        expect(field.otherUsersRatingCount).toBe(2);
    });
});
