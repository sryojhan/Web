
/**
 * Runs the code for the filter option in projects
 */
function init_filtering(){
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
