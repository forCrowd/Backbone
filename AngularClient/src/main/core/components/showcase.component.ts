import { Component, OnInit } from "@angular/core";
import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";

import { RatingMode, Project } from "../entities/project";
import { ProjectService } from "../project.service";

@Component({
    animations: [
        trigger("viewModeChanged", [
            state("true", style({ opacity: 1 })),
            state("false", style({ opacity: 0 })),
            transition("* => *", animate(".5s"))
        ]),
        trigger("test", [
            state("testState", style({ backgroundColor: "pink" }))
        ]),
        trigger("fadeInOut", [
            //state("buttons", style({ opacity: 1 })),
            //state("results", style({ opacity: 1 })),
            transition("void => *", [
                style({ opacity: 0 }),
                animate("0.5s ease-in")
            ]),
            transition("buttons <=> results", [
                //style({ opacity: 1, backgroundColor: "yellow" }),
                //animate("0.5s ease-in", style({ opacity: 0 }))
                //style({ fontSize: 0 }),
                animate("2s", keyframes([
                    style({ fontSize: "1em" }),
                    style({ fontSize: "0" }),
                    style({ fontSize: "1em" })
                ]))
            ]),
            transition("* => void", [
                animate("0.5s 0.1s ease-out", style({ opacity: 0 }))
            ])
        ]),
        trigger("flyInOut", [
            state("in", style({ opacity: 1, transform: "translateX(0)" })),
            transition("void => *", [
                style({
                    opacity: 0,
                    transform: "translateX(-100%)"
                }),
                animate("0.2s ease-in")
            ]),
            transition("* => void", [
                animate("0.2s 0.1s ease-out", style({
                    opacity: 0,
                    transform: "translateX(100%)"
                }))
            ])
        ])
    ],
    selector: "showcase",
    styleUrls: ["showcase.component.css"],
    templateUrl: "showcase.component.html"
})
export class ShowcaseComponent implements OnInit {

    project: Project = null;
    ratingMode = RatingMode;
    saveStream = new Subject();
    viewMode = "buttons"; // buttons | results

    get buttonsVisibility(): string {
        return (this.viewMode === "buttons").toString();
    }
    get resultsVisibility(): string {
        return (this.viewMode === "results").toString();
    }

    constructor(private projectService: ProjectService) {
    }

    ngOnInit(): void {

        this.projectService.getProjectExpanded(2)
            .subscribe(project => {

                if (!project) return;

                this.project = project;
                this.project.toggleRatingMode();

                //this.adminService.updateComputedFields(project).subscribe(() => { console.log("okke"); });
            });

        // Delayed save operation
        this.saveStream.debounceTime(1000)
            .mergeMap(() => this.projectService.saveChanges()).subscribe();
    }

    like(): void {
        if (this.viewMode === "buttons") {
            return;
        }

        const likeCell = this.project.ElementSet[0].ElementItemSet[0].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(likeCell, 100);

        const dislikeCell = this.project.ElementSet[0].ElementItemSet[1].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(dislikeCell, 0);

        this.projectService.saveChanges().subscribe(() => {
            this.viewMode = "results";
        });

        console.log("nihe");
    }

    dislike(): void {
        if (this.viewMode === "buttons") {
            return;
        }

        const likeCell = this.project.ElementSet[0].ElementItemSet[0].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(likeCell, 0);

        const dislikeCell = this.project.ElementSet[0].ElementItemSet[1].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(dislikeCell, 100);

        this.projectService.saveChanges().subscribe(() => {
            this.viewMode = "results";
        });

        console.log("uhuuu");
    }

    vote(likeRating: number, dislikeRating: number): void {

        if (this.viewMode === "results") {
            return;
        }

        const likeCell = this.project.ElementSet[0].ElementItemSet[0].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(likeCell, likeRating);

        const dislikeCell = this.project.ElementSet[0].ElementItemSet[1].ElementCellSet[0];
        this.projectService.updateElementCellDecimalValue(dislikeCell, dislikeRating);

        this.projectService.saveChanges().subscribe(() => {
            this.viewMode = "results";
        });

        console.log("uhuuu");
    }

    displayButtons(): void {
        this.viewMode = "buttons";
    }
}
