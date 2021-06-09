//The array containing the words that should be replaced and what they should be replaced with
let replaceList = [
  {
  },
];


function handleFileSelect(evt) {

  //We collect the selected file
  var files = evt.target.files;

  // use the first file from the list
  f = files[0];

  var reader = new FileReader();

  //What happens when the file is loaded in
  reader.onload = (function (theFile) {
    return function (e) {

      //Here we have the data of the file
      let data = e.target.result;

      //Here we send the data to the function that checks if a specific word exist in the list
      data = checkText(data);

      //We split the data so we can easily create a table
      var allRows = data.split(/\r?\n|\r/);
      var table = '<table id = "theTable">';
      for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        if (singleRow === 0) {
          table += '<thead>';
          table += '<tr id = "topTable">';
        } else {
          table += '<tr>';
        }
        var rowCells = allRows[singleRow].split('\t');
        for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
          if (singleRow === 0) {
            table += '<th>';
            table += rowCells[rowCell];
            table += '</th>';
          } else {
            table += '<td>';
            table += rowCells[rowCell];
            table += '</td>';
          }
        }
        if (singleRow === 0) {
          table += '</tr>';
          table += '</thead>';
          table += '<tbody>';
        } else {
          table += '</tr>';
        }
      }
      table += '</tbody>';
      table += '</table>';
      $('#boxForTheTable').append(table);



      var filename, link;
      if (data == null)
        return;

      filename = "washed.csv";

      if (!data.match(/^data:text\/csv/i)) {
        data = 'data:text/csv;charset=utf-8,' + data;
      }
      data = encodeURI(data);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.innerHTML = "Download file";
      link.id = "downloadButton";


      let form = document.getElementById("theForm");
      form.appendChild(link);

    };


  })(f);
  // Read in the image file as a data URL.
  reader.readAsText(f);
}

function checkText(data) {
  
  //The Regex that check if the word is contained
  const swedishCharClass = '[a-zäöå]';
  const doesWordExist = (s, word) => new RegExp(
    '(?<!' + swedishCharClass + ')' + word + '(?!' + swedishCharClass + ')', 'i'
  ).test(s);

  //Find where the word is contained
  const whereWordExist = (s,word) => s.matchAll(
    '(?<!' + swedishCharClass + ')' + word + '(?!' + swedishCharClass + ')', 'i'
  );
    
  //The text that is being checked
  let washText = data;
  
  //We use a counter to go remember where we are in the list
  let counter = 0;
  //We use every word in the array
  for (let i = 0; i < replaceList.length; i++) {
    counter++;

    //If the word we are looking for exist
    if (doesWordExist(washText, replaceList[i].word) == true) {
      console.log("found")
          
      //Lets find all the locations of the words
      washText = washText.toLowerCase();
      let matchAll = Array.from(whereWordExist(washText, replaceList[i].word));

      let theWord = matchAll[0][0];
      let theWordLength = theWord.length;

      for (let y = 0; y < matchAll.length; y++) {
        let theMatchWord = Array.from(whereWordExist(washText, replaceList[i].word));
              
        washText = remove_character(washText, theMatchWord[0].index, theWordLength)
        washText = insert(washText, theMatchWord[0].index, replaceList[i].replace)
      }

      if (counter == replaceList.length) {
        return washText;
      }
    } else {}
  }
  return washText;
}

 /** 
  * @param {*the string where we remove the word} str 
  * @param {*the location number where the word starts} position 
  * @param {*the length of the word that we are removing} length 
  * @returns We return the string without the removed word
  */
function remove_character(str, position, length) {
  part1 = str.substring(0, position);
  part2 = str.substring(position + length, str.length);
  return (part1 + part2);
}
 
 
 /**
  * 
  * @param {*the string where we remove the word} theString 
  * @param {*the location number where we want to insert the word} position 
  * @param {*the new word we want to add} newWord 
  * @returns We return the string with the added word 
  */
function insert(theString, position, newWord) {
  if(typeof(position) == "undefined") {
    position = 0;
  }
  if(typeof(newWord) == "undefined") {
    newWord = '';
  }
  return theString.slice(0, position) + newWord + theString.slice(position);
}


function replaceWordFunction() {

  //The word that will be replaced, followed by the word that is replacing it
  const replaceWord = document.getElementById("replaceWord").value;
  const replaceWordWith = document.getElementById("replaceWordWith").value;

  document.getElementById("replaceWord").value = "";
  document.getElementById("replaceWordWith").value = "";


  //If the user has typed in a word to be replaced
  if (replaceWord !== "" && replaceWord !== null) {
    //We add the word to the array
    replaceList.push(
      {
        word: replaceWord,
        replace: replaceWordWith
      }
    )
  }
//We log out the array to check that it worked
console.log(replaceList)
}

function clearBoard(event) {
  event.preventDefault();
  
  let theBody = document.getElementById("boxForTheTable");
  let settings = document.getElementById("theForm");
  let theTable = document.getElementById("theTable");
  let download = document.getElementById("downloadButton");
  let upload = document.getElementById("upload");

  if (theTable) {
    theBody.removeChild(theTable);
    settings.removeChild(download);
    upload.value = "";
  }
}
 
document.getElementById('upload').addEventListener('change', handleFileSelect, false);