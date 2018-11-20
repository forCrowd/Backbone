import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Project, User, NotificationService } from "backbone-client-core";

import { ProjectService } from "../core/core.module";
import { settings } from "../../settings/settings";

@Component({
  selector: "project-manager",
  templateUrl: "project-manager.component.html",
  styleUrls: ["project-manager.component.css"]
})
export class ProjectManagerComponent implements OnInit {

  isEditing = false;
  project: Project = null;
  selectedTabIndex = 0;
  user: User;
  viewMode = "new"; // new | existing

  get metadataUrl(): string {
    return `${settings.serviceODataUrl}/$metadata`;
  }

  get projectBasicApiUrl(): string {
    return `${settings.serviceODataUrl}/Project(${this.project.Id})`;
  }

  get projectGuestExpandedApiUrl(): string {
    return `${settings.serviceODataUrl}/Project(${this.project.Id})?$expand=User,ElementSet/ElementFieldSet,ElementSet/ElementItemSet/ElementCellSet`;
  }

  get projectOwnerExpandedApiUrl(): string {
    return `${settings.serviceODataUrl}/Project(${this.project.Id})?$expand=User,ElementSet/ElementFieldSet/UserElementFieldSet,ElementSet/ElementItemSet/ElementCellSet/UserElementCellSet`;
  }

  get isBusy(): boolean {
    return this.projectService.isBusy;
  };

  constructor(private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  cancelProject() {
    this.project.entityAspect.rejectChanges();

    const command = `/users/${this.project.User.UserName}`;
    this.router.navigate([command]);
  }

  canDeactivate() {

    if (!this.projectService.hasChanges()) {
      return true;
    }

    if (confirm("Discard changes?")) {
      this.projectService.rejectChanges();
      return true;
    } else {
      return false;
    }
  }

  createProjectEmpty(): void {
    this.project = this.projectService.createProjectEmpty();

    this.projectService.saveChanges()
      .subscribe(() => {
        const command = `/projects/${this.project.Id}/edit`;
        this.router.navigate([command]);
      });
  }

  createProjectBasic(): void {
    this.project = this.projectService.createProjectBasic();

    this.projectService.saveChanges()
      .subscribe(() => {
        const command = `/projects/${this.project.Id}/edit`;
        this.router.navigate([command]);
      });
  }

  createProjectParentChild(): void {
    this.project = this.projectService.createProjectParentChild();

    this.projectService.saveChanges()
      .subscribe(() => {
        const command = `/projects/${this.project.Id}/edit`;
        this.router.navigate([command]);
      });
  }

  createProjectTodo(): void {
    this.project = this.projectService.createProjectTodo();

    this.projectService.saveChanges()
      .subscribe(() => {
        const command = `/projects/${this.project.Id}/edit`;
        this.router.navigate([command]);
      });
  }

  copyApiLink(val: string){
    let sel = document.createElement('textarea');
    sel.style.position = 'fixed';
    sel.style.left = '0';
    sel.style.top = '0';
    sel.style.opacity = '0';
    sel.value = val;
    document.body.appendChild(sel);
    sel.focus();
    sel.select();
    document.execCommand('copy');
    document.body.removeChild(sel);
    this.notificationService.notification.next("Api link copied to clipboard");
  }

  manageProject(): void {
    this.project.entityAspect.rejectChanges();

    const command = `/projects/${this.project.Id}/edit`;
    this.router.navigate([command]);
  }

  isEditingChanged(isEditing: boolean): void {
    this.isEditing = isEditing;
  }

  ngOnInit(): void {
    this.viewMode = this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path;

    if (this.viewMode === "edit") this.viewMode = "existing";

    if (this.viewMode !== "new") {
      const projectId: number = this.activatedRoute.snapshot.params["project-id"];

      this.projectService.getProjectExpanded(projectId)
        .subscribe(project => {

          // Not found, navigate to 404
          if (!project) {
            const url = window.location.href.replace(window.location.origin, "");
            this.router.navigate(["/app/not-found", { url: url }]);
            return;
          }

          this.project = project;
        });
    }
  }

  saveProject() {
    this.projectService.saveChanges().subscribe();
  }

  selectedTabChanged($event): void {
    this.selectedTabIndex = $event.index;
  }

  submitDisabled(entity: string) {
    let hasValidationErrors = this.project.entityAspect.getValidationErrors().length > 0;
    return this.isBusy || hasValidationErrors;
  }
}
