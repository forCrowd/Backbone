import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";

export class Project extends EntityBase {

  // Server-side
  Id = 0;
  User: User;
  Name = "";
  Origin = "";
  Description = "";
  RatingCount = 0;
  ElementSet: Element[];

  initialize() {
    if (this.initialized) return;

    super.initialize();

    this.ElementSet.forEach(element => {
      element.initialize();
    });
  }
}
