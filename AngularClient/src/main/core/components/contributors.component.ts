import { Component } from "@angular/core";

@Component({
    selector: "contributors",
    templateUrl: "contributors.component.html",
    styleUrls: ["contributors.component.css"]
})
export class ContributorsComponent {

    getExperienceYears(year: number): string {
        const totalYears = new Date().getUTCFullYear() - year;
        return `${totalYears}+`;
    }

    getJoinedOnDate(day: number, month: number, year: number): Date {
        return new Date(year, month - 1, day);
    }
}
