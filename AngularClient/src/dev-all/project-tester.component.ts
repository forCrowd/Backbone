import { Component, OnInit } from "@angular/core";
import { Project, ProjectService } from "@forcrowd/backbone-client-core";

import { AdminService } from "../main/admin/admin.service";

@Component({
  selector: "project-tester",
  styleUrls: ["project-tester.component.css"],
  templateUrl: "project-tester.component.html"
})
export class ProjectTesterComponent implements OnInit {

  project: Project = null;

  constructor(private adminService: AdminService, private projectService: ProjectService) {
  }

  ngOnInit(): void {

    this.projectService.getProjectExpanded(1) // Set any existing username/project key from db
      .subscribe(project => {
        this.project = project;
        //this.adminService.updateComputedFields(project).subscribe(() => { console.log("okke"); });
      });
  }
}
