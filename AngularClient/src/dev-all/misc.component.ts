import { Component } from "@angular/core";
import { timer as observableTimer } from "rxjs";

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
    observableTimer(1000).subscribe(() => {
      console.log("rxjs test");
    });
  }
}
