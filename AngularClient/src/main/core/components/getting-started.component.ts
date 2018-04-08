import { Component, OnInit } from "@angular/core";

import { Project } from "../entities/project";
import { User } from "../entities/user";
import { AuthService } from "../auth.service";
import { ProjectService } from "../project.service";

@Component({
    templateUrl: "getting-started.component.html",
    styleUrls: ["getting-started.component.css"]
})
export class GettingStartedComponent implements OnInit {

    project: Project = null;

    constructor(private readonly authService: AuthService,
        private readonly projectService: ProjectService) { }

    ngOnInit(): void {

        var currentUser = this.authService.currentUser;

        if (!currentUser.isAuthenticated()) return;

        this.authService.getUser(currentUser.UserName).subscribe(() => {
            for (var i = 0; i < currentUser.ProjectSet.length; i++) {
                var project = currentUser.ProjectSet[i];
                if (project.Name === "Todo App") {
                    this.project = project;
                    break;
                }
            }
        });
    }

    copy() {
        var textarea = document.createElement("textarea") as HTMLTextAreaElement;
        textarea.innerHTML = this.getExampleCode()
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    createProject(): void {

        this.project = this.projectService.createProjectTodo();

        this.projectService.saveChanges().subscribe();
    }

    getExampleCode(): string {

        if (!this.project) return "";

        const exampleCode =
            `<!doctype html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://backbone.forcrowd.org/assets/examples/todo-app/index.css" />
</head>
<body>
    <div id="todo-app">
        <header>
            <h1 id="project-name"></h1>
            <div id="status" class="hide">
                Please wait ...
            </div>
        </header>
        <div id="main">
            <ul id="todo-list"></ul>
        </div>
    </div>
    <footer id="info">
        Powered by <a href="https://backbone.forcrowd.org" target="_blank">Backbone</a><br />
        Design by <a href="http://todomvc.com" target="_blank">TodoMVC</a><br />
        Version 0.3<br />
    </footer>
    <script type="text/javascript" src="https://backbone.forcrowd.org/assets/examples/todo-app/index.js"></script>
    <script type="text/javascript">

        var projectId = ${this.project.Id};
        var token = "${this.authService.currentUser.token.access_token}";

        init(projectId, token);

    </script>
</body>
</html>`;

        return exampleCode;

    }
}
