import { Component } from "@angular/core";

import { AuthService } from "../main/core/auth.service";
import { User } from "../main/core/entities/user";

@Component({
    selector: "odata",
    templateUrl: "odata.component.html"
})
export class ODataComponent {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    constructor(private authService: AuthService) { }

}
