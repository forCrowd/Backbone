import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";

export class Project extends EntityBase {

  // Server-side
  Id = 0;
  User: User;
  RatingCount = 0;
  ElementSet: Element[];

  get Name(): string {
    return this.fields.name;
  }
  set Name(value: string) {
    this.fields.name = value.trim();
  }

  get Origin(): string {
    return this.fields.origin;
  }
  set Origin(value: string) {
    this.fields.origin = value.trim();
  }

  get Description(): string {
    return this.fields.description;
  }
  set Description(value: string) {
    this.fields.description = value ? value.trim() : null;
  }

  private fields: {
    description: string,
    name: string,
    origin: string,
  } = {
      description: null,
      name: "",
      origin: "",
    };

  initialize(): void {
    if (this.initialized) return;

    super.initialize();

    this.ElementSet.forEach(element => {
      element.initialize();
    });
  }
}
