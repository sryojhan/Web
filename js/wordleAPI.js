
// let request = new XMLHttpRequest()

// let url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
// request.open('GET', url + "hello", true)
// request.onload = function () {
//     // Begin accessing JSON data here
//     let data = JSON.parse(this.response)
//     if (request.status >= 200 && request.status < 400) {
//         data.forEach(meanings => {
//             meanings.meanings.forEach(m => {
//                 m.definitions.forEach(def => console.log(def.definition));
//             });
//         })
//     } else {
//         console.log('error')
//     }
// }

// request.send()

// let palabraExistente = new XMLHttpRequest();

// let url = "https://dle.rae.es/";

// let palabra = "universo";

// palabraExistente.open('GET', url + palabra);

// palabraExistente.onload = function(){
//     console.log("Holaa");
// }

// palabraExistente.send();