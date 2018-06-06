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

  exampleCode = "";
  project: Project = null;
  version = "1.0";

  get currentUser() {
    return this.authService.currentUser;
  }

  constructor(private readonly authService: AuthService,
    private readonly projectService: ProjectService) {
  }

  ngOnInit(): void {

    if (!this.currentUser || !this.currentUser.isAuthenticated()) return;

    this.authService.getUser(this.currentUser.UserName).subscribe(() => {

      for (var i = 0; i < this.currentUser.ProjectSet.length; i++) {

        var project = this.currentUser.ProjectSet[i];

        if (project.Name === "Todo App") {
          this.project = project;
          this.generateExampleCode();
          break;
        }
      }
    });
  }

  copy() {
    var textarea = document.createElement("textarea") as HTMLTextAreaElement;
    textarea.innerHTML = this.exampleCode;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  createProject(): void {

    this.project = this.projectService.createProjectTodo();

    this.projectService.saveChanges().subscribe(() => {
      this.generateExampleCode();
    });
  }

  private generateExampleCode(): void {

    this.exampleCode =
      `<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${location.origin}/assets/examples/todo-app/index.css?v=${this.version}" />
</head>
<body>
    <div id="todo-app">
        <header>
            <h1 id="project-name">Todo App</h1>
            <h2>User: <span id="user-name">Guest</span></h2>
            <div class="hide" id="status">
                Please wait ...
            </div>
        </header>
        <div id="main">
            <input autofocus="" id="new-item-input" onkeyup="app.createItem(event)" placeholder="What needs to be done?" >
            <ul id="todo-list">
                <li id="todo-item-0">
                    <input class="toggle" id="item-input-0" onclick="app.updateItem(0);" type="checkbox" />
                    <label for="item-input-0" id="item-label-0">Todo item</label>
                    <button class="destroy" id="item-button-0" onclick="app.removeItem(0);"></button>
                </li>
            </ul>
        </div>
    </div>
    <footer id="info">
        Powered by <a href="https://backbone.forcrowd.org" target="_blank">Backbone</a><br />
        Design by <a href="http://todomvc.com" target="_blank">TodoMVC</a><br />
        Version ${this.version}<br />
    </footer>
    <script type="text/javascript">

        var app = this.app = {

            /* Access token of your Backbone account
             * Please be aware that this is not the best security practice! */
            currentUserToken: "${this.currentUser.token.access_token}",

            /* Project ID of your 'Todo App' */
            projectId: ${this.project.Id}
        };

    </script>
    <script type="text/javascript" src="${location.origin}/assets/examples/todo-app/index.js?v=${this.version}"></script>
</body>
</html>`;

  }
}
