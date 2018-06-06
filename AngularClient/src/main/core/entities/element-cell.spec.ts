import { TestHelpers } from "./test-helpers";

describe("main/core/entities/element-cell", () => {

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount - Initial", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.otherUsersDecimalValueTotal).toBe(0);
    expect(cell.otherUsersDecimalValueCount).toBe(0);
  });

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount  - Without user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25, 3);

    expect(cell.otherUsersDecimalValueTotal).toBe(25);
    expect(cell.otherUsersDecimalValueCount).toBe(3);
  });

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount  - With user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25, 3, 10);

    expect(cell.otherUsersDecimalValueTotal).toBe(15);
    expect(cell.otherUsersDecimalValueCount).toBe(2);
  });
});
