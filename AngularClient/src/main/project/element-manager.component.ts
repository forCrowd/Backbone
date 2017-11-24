import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Element } from "../core/entities/element";
import { ProjectService } from "../core/core.module";

@Component({
    selector: "element-manager",
    templateUrl: "element-manager.component.html",
    styleUrls: ["element-manager.component.css"]
})
export class ElementManagerComponent {

    @Input() element: Element;
    @Output() cancelled = new EventEmitter();
    @Output() saved = new EventEmitter();

    get isBusy(): boolean {
        return this.projectService.isBusy;
    }

    constructor(private projectService: ProjectService) { }

    cancelElement() {
        this.element.rejectChanges();
        this.cancelled.emit();
    }

    saveElement() {
        this.projectService.saveChanges().subscribe(() => {
            this.saved.emit();
        });
    }

    submitDisabled() {
        return this.isBusy || this.element.entityAspect.getValidationErrors().length > 0;
    }
}
