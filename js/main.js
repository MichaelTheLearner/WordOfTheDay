
let wordsInTextFile;
const WORDFILE = "../engmix.txt"
var storedText
var storedDefObj
var textArray

// let randomNumber = () => Math.floor(Math.random() * wordsInTextFile)
let randomNumber = () => {
    const i = Math.floor(Math.random() * (wordsInTextFile - 1 + 1)) + 1;
    console.info(i)
    return i
}

// let readWordListTextFileAJAX = () => {
//     var request = new XMLHttpRequest();
//     request.open('GET', 'https://filesamples.com/samples/document/txt/sample3.txt', true);
    
//     request.onreadystatechange = function () {
//         let allText
//         if (request.readyState === 4) {
//             allText = request.responseText;
//         }
//         return allText
//     }
// }

let readWordListFILEREADER = () => {
  
  fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt')
  .then(function(response) {
    response.text().then(function(text) {
      storedText = text;
      
      main();
    });
  });
}


  
let getDefinitionJSON = (word) => {
    return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        });
   }


let checkIfWordFound = (jsonObj) => {
    if (jsonObj.hasOwnProperty('title')){
        return false
    }
    return true
    
    
    // if (jsonObj.title == "No Definitions Found"){
    //     return false
    // }
    //     return true

}
let getRandomWord = (textArray) => {    
    const lineNumber = randomNumber();
    const word = textArray[lineNumber]
    console.info(word)
    return word
}

let getDefinition = async (word) => {          
    let definitionJSON = await getDefinitionJSON(word)
    let definitionJSONobj = definitionJSON
    while (checkIfWordFound(definitionJSONobj) === false){
        definitionJSON = await getDefinition(getRandomWord(textArray))
        definitionJSONobj = definitionJSON
    } 
    return definitionJSONobj
}

let setDisplays = (jsonObj) => {
    let wordHeading = document.querySelector('#wordHeading')
    let defP = document.querySelector('#definitions')
    
    wordHeading.innerText = "";
    defP.innerHTML = "";

    if(jsonObj[0].hasOwnProperty("word")) {
        wordHeading.innerText = `${jsonObj[0].word}`
    }
    if(jsonObj[0].hasOwnProperty("meanings")) {
        for(let def in jsonObj[0].meanings){
            // definitions.innerHTML += `<p> ${def.definitions} </p>`
            defP.innerHTML += `<li class="definition">${jsonObj[0].meanings[def].definitions[0].definition}
                                <ul>
                                    <li class="source">
                                        ${jsonObj[0].sourceUrls[0]}
                                    </li>
                                </ul>
                                </li>
                                `
        }
    }
}
let getWordDB = () => {
    readWordListFILEREADER()
}

let main = async () => {
    
    textArray = storedText.split('\n');
    wordsInTextFile = textArray.length
    let word = ""
    let definitionJSONobj

    
        word = getRandomWord(textArray)
        definitionJSONobj = await getDefinition(word)
    

    setDisplays(definitionJSONobj)
}
getWordDB()
document.querySelector('#refreshButton').addEventListener('click', getWordDB)
