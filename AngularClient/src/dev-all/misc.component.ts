import { Component } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "misc",
    templateUrl: "misc.component.html"
})
export class MiscComponent {

    error(): void {
        throw new Error("test");
    }

    consoleLog(): void {
        console.log("test");
    }

    getNewDate(): Date {
        return new Date();
    }

    rxjsTest(): void {
        Observable.timer(1000).subscribe(() => {
            console.log("rxjs test");
        });
    }
}
