
var project = null;

function executeHttpRequest(method, url, callback, requestData) {
    requestData = requestData ? JSON.stringify(requestData) : null;

    // Update UI
    updateStatus(true);

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {

            // Return the response
            var responseData = JSON.parse(request.responseText);
            callback(responseData);

            // Update UI
            updateStatus(false);
        }
    }

    request.open(method, url, true); // true for asynchronous
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(requestData);
}

function init(projectId, token) {

    var projectUrl = `https://api.backbone.forcrowd.org/odata/v1/Project(${projectId})?$expand=User,ElementSet/ElementFieldSet,ElementSet/ElementItemSet/ElementCellSet/UserElementCellSet`;

    // Get project from Backbone
    executeHttpRequest("GET",
        projectUrl,
        loadProject);
}

function loadProject(projects) {

    // Get the project
    project = projects.value[0];

    // Title
    document.title = project.Name;

    // Header
    document.getElementById("project-name").innerText = project.Name;

    // Todo list
    var items = project.ElementSet[0].ElementItemSet;

    document.getElementById("todo-list").innerHTML = "";
    for (var i = 0; i < items.length; i++) {

        var item = items[i];
        var completed = item.ElementCellSet[0].UserElementCellSet[0].DecimalValue === "1.00";

        document.getElementById("todo-list").innerHTML +=
            `<li id="li${item.Id}" class="${completed ? "completed" : ""}">
                        <input id="input${item.Id}" class="toggle" type="checkbox" ${completed ? "checked" : ""} onclick="itemChanged(${item.Id});" />
                        <label for="input${item.Id}">${item.Name}</label>
                    </li>`;
    }
}

function itemChanged(itemId) {

    // Find item & user cell
    var item = null;

    for (var i = 0; i < project.ElementSet[0].ElementItemSet.length; i++) {
        if (project.ElementSet[0].ElementItemSet[i].Id === itemId) {
            item = project.ElementSet[0].ElementItemSet[i];
            break;
        }
    }

    var userCell = item.ElementCellSet[0].UserElementCellSet[0];

    // Current state
    var completed = userCell.DecimalValue === "1.00";

    // Update UI
    var itemElement = document.getElementById(`li${itemId}`);

    if (completed) {
        itemElement.classList.remove("completed");
    } else {
        itemElement.classList.add("completed");
    }

    // Prepare url & data
    var url = `https://api.backbone.forcrowd.org/odata/v1/UserElementCell(userId=${userCell.UserId},elementCellId=${userCell.ElementCellId})`;

    var data = {
        DecimalValue: completed ? "0.00" : "1.00",
        RowVersion: userCell.RowVersion,
    }

    // Update Backbone
    executeHttpRequest("PATCH", url, updateUserCell, data);

    // Update local variables
    function updateUserCell(updatedUserCell) {
        userCell.DecimalValue = updatedUserCell.DecimalValue;
        userCell.RowVersion = updatedUserCell.RowVersion;
    }
}

// Updates UI during the http requests
function updateStatus(requesting) {

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
