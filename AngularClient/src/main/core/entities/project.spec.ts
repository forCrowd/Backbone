import { RatingMode } from "./project";
import { TestHelpers } from "./test-helpers";

describe("main/core/entities/project", () => {

    it("Key: if not set, should be equal to Name", () => {

        var project = TestHelpers.createProject();

        project.Name = "name";

        expect(project.Key).toBe("name");
    });

    it("Key: if set, should stay as it is", () => {

        var project = TestHelpers.createProject();

        project.Key = "key";
        project.Name = "name";

        expect(project.Key).toBe("key");
    });

    it("toggleRatingMode: RatingMode should be 'All Users' after first call", () => {

        var project = TestHelpers.createProject();

        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.AllUsers);
    });

    it("toggleRatingMode: RatingMode should be 'Current User' after second call", () => {

        var project = TestHelpers.createProject();

        project.toggleRatingMode();
        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.CurrentUser);
    });
});
