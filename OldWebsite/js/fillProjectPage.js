
document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    const hash = window.location.hash;

    // Verificar la URL y modificar el contenido según corresponda

    fetch('./projects.json') // Asegúrate de que data.json esté en el mismo directorio que tu HTML
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {

            LoadProject(data[hash.substring(1)]);
        })
        .catch(error => {
            console.error('Error:', error);
        });

});



function LoadProject(project) {

    if (!project) {
        window.location.href = "./projects.html";

        console.log("proyecto no encontrado");
        return;
    }


    document.title = project.name;

    if (!project.page) {
        return;
    }
    //Page content


    function InsertHtmlElement(id, content) {

        let element = document.getElementById(id);
        if (project.page[content]) {

            element.innerHTML = project.page[content];
            return true;
        }
        else {
            element.remove();
            return false;
        }
    }

    if (!project.pageTitle) project.pageTitle = project.name;

    InsertHtmlElement("projectTitle", "title");
    InsertHtmlElement("projectSubtitle", "subtitle");
    InsertHtmlElement("projectDescriptionShort", "shortDescription");
    InsertHtmlElement("projectDescriptionLong", "longDescription");
    if (!InsertHtmlElement("projectDivider", "divider")) {
        document.getElementById("projectDividerBackground").remove();
    }
    InsertHtmlElement("projectSecondDescription", "secondDescription");


    //Page multimedia


    //console.log(document.getElementById("banner").style);
    if(project.page.banner)
    document.getElementById("banner").style.backgroundImage = 'url("' +  project.page.banner +  '")';

    document.getElementById("projectIcon").src = project.icon;

    let multimedia = "";

    let videoTemplate = `
        <video controls>
            <source src="$source">
        </video>`;

    let screenshotTemplate = `<img class="screenshot" src="$source">`;

    if (project.page.video)
        multimedia += videoTemplate.replace("$source", project.pageVideo);

    if (project.page.screenshots)
        project.page.screenshots.forEach(element => {

            multimedia += screenshotTemplate.replace("$source", element);
        });

    document.getElementsByTagName("multimedia")[0].innerHTML = multimedia;



    //Downloads
    function SetupDownloadButton(id, link) {

        let elem = document.getElementsByClassName(id)[0];

        if (link) {
            elem.href = link;
        }
        else elem.remove();
    }

    SetupDownloadButton("repository", project.page.github);
    SetupDownloadButton("download", project.page.download);
    SetupDownloadButton("processing", project.page.processing);
    SetupDownloadButton("itchio", project.page.itchio);




    function SetupConsoleButton(elem){

        if(!project[elem] || project[elem] === false){

            document.getElementById(elem).remove();
        }
    }

    SetupConsoleButton('switch');
    SetupConsoleButton('xbox');
    SetupConsoleButton('playstation');



    if(false && project.page.additionalHtml){

        
        fetch(project.page.additionalHtml)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load file: ${project.page.additionalHtml}`);
          }
          return response.text();
        })
        .then(html => {
          document.getElementById("additionalHtml").innerHTML = html;



          const scripts = document.getElementById("additionalHtml").getElementsByTagName("script");
          for (let script of scripts) {
            let newScript = document.createElement("script");
            if (script.src) {
              newScript.src = script.src;  // Cargar scripts externos
            } else {
              newScript.innerHTML = script.innerHTML;  // O ejecutar scripts inline
            }
            document.body.appendChild(newScript);  // Agregar el nuevo script al DOM
          }










        })
        .catch(error => {
          console.error('Error loading HTML:', error);
        });
    }
}