import { Subject } from "rxjs";

import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";
import { stripInvalidChars } from "../../shared/utils";

export interface IUniqueKey {
    username: string;
    projectKey: string;
}

export enum RatingMode {
    CurrentUser = 1,
    AllUsers = 2
}

export class Project extends EntityBase {

    // Server-side
    Id: number = 0;
    User: User;

    get Name(): string {
        return this.fields.name;
    }
    set Name(value: string) {
        if (this.fields.name !== value) {
            const oldStripped = stripInvalidChars(this.fields.name);
            this.fields.name = value;

            if (this.initialized) {

                // If "Key" is not a custom value (generated through Name), then keep updating it
                if (this.Key === oldStripped) {
                    this.Key = value;
                }
            }
        }
    }

    get Key(): string {
        return this.fields.key;
    }
    set Key(value: string) {
        const newValue = stripInvalidChars(value);

        if (this.fields.key !== newValue) {
            this.fields.key = newValue;
        }
    }

    Origin = "";
    Description = "";
    RatingCount = 0;
    ElementSet: Element[];

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

    get uniqueKey(): IUniqueKey {

        if (!this.initialized) {
            return null;
        }

        return {
            username: this.User.UserName,
            projectKey: this.Key
        };
    }

    ratingModeUpdated = new Subject<RatingMode>();

    private fields: {
        isAdded: boolean,
        key: string,
        name: string,
        ratingMode: number,
    } = {
        isAdded: false,
        key: "",
        name: "",
        ratingMode: RatingMode.CurrentUser,
    };

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementSet.forEach(element => {
            element.initialize();
        });

        return true;
    }

    remove() {

        // Related elements
        const elementSet = this.ElementSet.slice();
        elementSet.forEach(element => {
            element.remove();
        });

        this.entityAspect.setDeleted();
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === RatingMode.CurrentUser
            ? RatingMode.AllUsers
            : RatingMode.CurrentUser;
    }
}
