import { Subject } from "rxjs";

import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";
import { stripInvalidChars } from "../../shared/utils";

export enum RatingMode {
    CurrentUser = 1,
    AllUsers = 2
}

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

    // Client-side
    get RatingMode(): RatingMode {
        return this.fields.ratingMode;
    }
    set RatingMode(value: RatingMode) {
        if (this.fields.ratingMode !== value) {
            this.fields.ratingMode = value;
            this.ratingModeUpdated.next(value);
        }
    }

    ratingModeUpdated = new Subject<RatingMode>();

    private fields: {
        description: string,
        name: string,
        origin: string,
        ratingMode: number,
    } = {
        description: null,
        name: "",
        origin: "",
        ratingMode: RatingMode.CurrentUser,
    };

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementSet.forEach(element => {
            element.initialize();
        });

        return true;
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === RatingMode.CurrentUser
            ? RatingMode.AllUsers
            : RatingMode.CurrentUser;
    }
}
