import { Entity, EntityAspect, EntityType } from "../../../libraries/breeze-client";

export class EntityBase implements Entity {

  entityAspect: EntityAspect;
  entityType: EntityType;
  initialized = false; // Determines whether the entity is completely being created or loaded from server.

  CreatedOn = new Date();
  ModifiedOn = new Date();
  DeletedOn: Date | null = null;
  RowVersion: string = "AAAAAAAAAAA=";

  get $typeName(): string {
    if (!this.entityAspect) return "";
    return this.entityAspect.getKey().entityType.shortName;
  }

  // This function is being called after createEntity for each entity,
  // or the entities being retrieved with executeQueryObservable function
  // Initial preparation of the entity can be done here
  // First time calls return "true" flag, so the child objects can also complete their implementation
  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
  }
}
