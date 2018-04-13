
app._init = function () {

    // Globals
    app.currentUser = null;
    app.project = null;

    // Urls
    app.urls = {};
    app.urls.serviceApiUrl = "https://api.backbone.forcrowd.org/api/v1";
    app.urls.serviceODataUrl = "https://api.backbone.forcrowd.org/odata/v1";

    // Use these urls for local development
    //app.urls.serviceApiUrl = "http://localhost:15001/api/v1";
    //app.urls.serviceODataUrl = "http://localhost:15001/odata/v1";

    app.urls.currentUserUrl = `${app.urls.serviceApiUrl}/Account/CurrentUser`;
    app.urls.projectUrl = `${app.urls.serviceODataUrl}/Project(${app.projectId})?$expand=User,ElementSet/ElementFieldSet,ElementSet/ElementItemSet/ElementCellSet/UserElementCellSet`;
    app.urls.createElementItemUrl = `${app.urls.serviceODataUrl}/ElementItem`;
    app.urls.createElementCellUrl = `${app.urls.serviceODataUrl}/ElementCell`;
    app.urls.createUserElementCellUrl = `${app.urls.serviceODataUrl}/UserElementCell`;

    // Get template elements
    app.elements = {};
    app.elements.todoInput = document.getElementById("item-input-0");
    app.elements.todoLabel = document.getElementById("item-label-0");
    app.elements.todoButton = document.getElementById("item-button-0");
    app.elements.todoListItem = document.getElementById("todo-item-0");

    // Clear template
    document.getElementById("todo-item-0").outerHTML = "";

    // Get current user
    app.executeHttpRequest("GET", app.urls.currentUserUrl, null, app.loadCurrentUser);
}

app.addTodoItem = function (elementItem) {

    // Current state?
    var completed = elementItem
        .ElementCellSet[0]
        .UserElementCellSet[0]
        .DecimalValue === "1.00";

    // Input element
    app.elements.todoInput.setAttribute("id", `item-input-${elementItem.Id}`);
    app.elements.todoInput.setAttribute("onclick", `app.updateItem(${elementItem.Id});`);
    if (completed)
        app.elements.todoInput.setAttribute("checked", "");
    else
        app.elements.todoInput.removeAttribute("checked");

    // Label element
    app.elements.todoLabel.setAttribute("id", `item-label-${elementItem.Id}`);
    app.elements.todoLabel.setAttribute("for", `item-input-${elementItem.Id}`);
    app.elements.todoLabel.innerHTML = elementItem.Name;

    // Button element
    app.elements.todoButton.setAttribute("id", `item-button-${elementItem.Id}`);
    app.elements.todoButton.setAttribute("onclick", `app.removeItem(${elementItem.Id});`);

    // List item element
    app.elements.todoListItem.setAttribute("id", `todo-item-${elementItem.Id}`);
    if (completed)
        app.elements.todoListItem.classList.add("completed");
    else
        app.elements.todoListItem.classList.remove("completed");

    app.elements.todoListItem.innerHTML = app.elements.todoInput.outerHTML + app.elements.todoLabel.outerHTML + app.elements.todoButton.outerHTML;

    // Append
    document.getElementById("todo-list").innerHTML += app.elements.todoListItem.outerHTML;
}

app.createItem = function (event) {

    // Ignore, except "Enter"
    if (event.keyCode !== 13) return;

    // Target
    var target = event.target || event.srcElement;

    // Element item name
    var elementItemName = target.value;
    target.value = "";

    // Element item
    var elementItemData = {
        ElementId: app.project.ElementSet[0].Id,
        Name: elementItemName
    };

    // Create element item
    app.executeHttpRequest("POST", app.urls.createElementItemUrl, elementItemData, function (elementItem) {

        app.project.ElementSet[0].ElementItemSet.push(elementItem);

        // Element cell
        var elementCellData = {
            ElementItemId: elementItem.Id,
            ElementFieldId: app.project.ElementSet[0].ElementFieldSet[0].Id
        };

        // Create element cell
        app.executeHttpRequest("POST", app.urls.createElementCellUrl, elementCellData, function (elementCell) {

            elementItem.ElementCellSet = [elementCell];

            // User element cell
            var userElementCellData = {
                UserId: app.currentUser.Id,
                ElementCellId: elementCell.Id,
                DecimalValue: "0.00"
            };

            // Create user element cell
            app.executeHttpRequest("POST", app.urls.createUserElementCellUrl, userElementCellData, function (userElementCell) {

                elementCell.UserElementCellSet = [userElementCell];

                // Update UI
                app.addTodoItem(elementItem);
            });
        });
    });
}

app.executeHttpRequest = function (method, url, requestData, callback) {
    requestData = requestData ? JSON.stringify(requestData) : null;

    // Update UI
    app.updateStatus(true);

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4
            && (request.status === 200
                || request.status === 201
                || request.status === 204)) {

            // Return the response
            if (callback) {
                var responseData = JSON.parse(request.responseText || null);
                callback(responseData);
            }

            // Update UI
            app.updateStatus(false);
        }
    }

    request.open(method, url, true); // true for asynchronous
    request.setRequestHeader("Authorization", `Bearer ${app.currentUserToken}`);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(requestData);
}

app.loadCurrentUser = function (currentUser) {

    app.currentUser = currentUser;

    // Update UI
    document.getElementById("user-name").innerHTML = currentUser.UserName;

    // Get project
    app.executeHttpRequest("GET",
        app.urls.projectUrl,
        null,
        app.loadProject);
}

app.loadProject = function (projects) {
    
    if (!projects) return;

    // Get the project
    app.project = projects.value[0];

    if (!app.project) return;

    // Title
    document.title = app.project.Name;

    // Header
    document.getElementById("project-name").innerText = app.project.Name;

    // Update UI 
    var elementItems = app.project.ElementSet[0].ElementItemSet;

    for (var i = 0; i < elementItems.length; i++) {

        // Get element item
        var elementItem = elementItems[i];

        // Update UI
        app.addTodoItem(elementItem);
    }
}

app.updateItem = function (elementItemId) {

    // Input element
    var input = document.getElementById(`item-input-${elementItemId}`);

    // Current state
    var completed = !input.checked;

    // Update UI
    var listItem = document.getElementById(`todo-item-${elementItemId}`);

    if (completed) {
        listItem.classList.remove("completed");
    } else {
        listItem.classList.add("completed");
    }

    // Update Backbone
    if (!app.project) return;

    var userCell = null;

    for (var i = 0; i < app.project.ElementSet[0].ElementItemSet.length; i++) {
        if (app.project.ElementSet[0].ElementItemSet[i].Id === elementItemId) {
            userCell = app.project.ElementSet[0].ElementItemSet[i].ElementCellSet[0].UserElementCellSet[0];
            break;
        }
    }

    if (!userCell) return;

    // Prepare url & data
    var updateUserElementCellUrl = `${app.urls.serviceODataUrl}/UserElementCell(userId=${app.currentUser.Id},elementCellId=${userCell.ElementCellId})`;

    var userElementCellData = {
        DecimalValue: completed ? "0.00" : "1.00",
        RowVersion: userCell.RowVersion,
    }

    // Execute request
    app.executeHttpRequest("PATCH", updateUserElementCellUrl, userElementCellData, function (updatedUserCell) {
        userCell.DecimalValue = updatedUserCell.DecimalValue;
        userCell.RowVersion = updatedUserCell.RowVersion;
    });
}

app.removeItem = function (elementItemId) {

    // Update UI
    document.getElementById(`todo-item-${elementItemId}`).outerHTML = "";

    // Update Backbone
    if (!app.project) return;

    var item = null;

    for (var i = 0; i < app.project.ElementSet[0].ElementItemSet.length; i++) {
        if (app.project.ElementSet[0].ElementItemSet[i].Id === elementItemId) {
            item = app.project.ElementSet[0].ElementItemSet[i];
            break;
        }
    }

    if (!item) return;

    // Prepare url & data
    var deleteElementItemUrl = `${app.urls.serviceODataUrl}/ElementItem(${elementItemId})`;

    // Execute request
    app.executeHttpRequest("DELETE", deleteElementItemUrl);
}

app.updateStatus = function (requesting) {

    if (requesting) {

        document.getElementById("status").classList.remove("hide");

        var items = document.getElementsByTagName("input");
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = true;
        }

    } else {

        document.getElementById("status").classList.add("hide");

        var items = document.getElementsByTagName("input");
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = false;
        }
    }
}

// Run the application
app._init();
