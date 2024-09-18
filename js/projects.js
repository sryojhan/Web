

document.addEventListener("DOMContentLoaded", function () {

    fetch('projects.json') // Asegúrate de que data.json esté en el mismo directorio que tu HTML
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {

            populateProjects(data);
            init_filtering();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function populateProjects(data) {

    let parentContainer = document.getElementById("lista").getElementsByTagName("ul")[0];


    let groupTemplate = `<div class='grupo'><h1>$GroupName</h1>
    `;
    let elementTemplate = `<a target='$target' href='$url'>
    <li>
        <img style='border-radius: 10px; ' src='$icon'>
        <h1>$Name</h1>
        <p>$Description</p>
    </li>
    </a>
    
    `;

    let lastGroup = false;

    let OpenGroup = function (groupName) {

        return groupTemplate.replace("$GroupName", groupName);
    };

    let CloseGroup = function () {
        return '</div>';
    }

    let SetProjectData = function (project, key) {
        return elementTemplate
            .replace("$url", './projectPage.html#' + 
                key.replace("fav_", ''))
            .replace("$icon", project.icon)
            .replace("$Description", project.description)
            .replace("$Name", project.name)
            .replace("$target", project.target);
    }

    let htmlData = "";
    Object.keys(data).forEach(key => {

        let project = data[key];


        if (project.group) {

            if (lastGroup) {
                htmlData += CloseGroup();
            }

            lastGroup = true;
            htmlData += OpenGroup(project.group);
        }

        htmlData += SetProjectData(project, key);

    });
    
    CloseGroup();
    parentContainer.innerHTML += htmlData;
}

/**
 * Runs the code for the filter option in projects
 */
function init_filtering() {


    let input = document.querySelector("input");
    let list = document.getElementById("lista");
    input.addEventListener('input', this.updateResults);
    input.elementList = list;
}


function updateResults(e) {
    let somethingVisible = false;

    let list = e.currentTarget.elementList;
    let inputText = e.srcElement.value.toLowerCase();


    for (let group of list.getElementsByClassName("grupo")) {
        //Each of the groups inside the list (i.e. Classic games)


        let visible = false;
        let groupVisible = subString(group.getElementsByTagName("h1")[0].innerHTML, inputText);
        for (let element of group.getElementsByTagName("li")) {

            let h1 = element.getElementsByTagName("h1")[0];
            if (groupVisible || subString(h1.innerHTML, inputText)) {
                element.style.display = "table";
                visible = true;
            } else {
                element.style.display = "none";
            }
        }

        somethingVisible |= visible;
        group.style.display = visible ? "block" : "none";
    }

    document.getElementById("nothing").style.display = somethingVisible ? "none" : "block";
}


function subString(container, contained) {
    container = container.toLowerCase();
    contained = contained.toLowerCase();
    let c = 0;
    for (let i = 0; i < contained.length; i++) {
        let founded = false;
        while (c < container.length) {
            if (container[c] == contained[i]) {
                founded = true;
                break;
            }
            c++;
        }
        if (!founded)
            return false;
    }
    return true;
}
