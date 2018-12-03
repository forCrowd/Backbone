import { TestHelpers } from "./test-helpers";

describe("entities/project", () => {

  it("should be defined", () => {

    var project = TestHelpers.createProject();
    expect(project).toBeDefined();

  });

});
