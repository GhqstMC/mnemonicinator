let justStarted = true;
// fetch the initial list of dreams
const list = [
  "aaa1",
  "eae1",
  "aii1",
  "eio1",
  "eae2",
  "aee2",
  "eio2",
  "aoo2",
  "aai3",
  "iai3",
  "aii3",
  "eao3",
  "oao3",
  "eio3",
  "aai4",
  "aee4",
  "iai4",
  "eao4",
  "eio4"
];
const list2 = [
  "AAA-1",
  "EAE-1",
  "AII-1",
  "EIO-1",
  "EAE-2",
  "AEE-2",
  "EIO-2",
  "AOO-2",
  "AAI-3",
  "IAI-3",
  "AII-3",
  "EAO-3",
  "OAO-3",
  "EIO-3",
  "AAI-4",
  "AEE-4",
  "IAI-4",
  "EAO-4",
  "EIO-4"
];

list.forEach(function(item, index) {
  document.getElementById(item).setAttribute("data-tooltip", list2[index]);
});

function randomizeArray() {
  console.log(document.getElementById("english-words").checked);
  let p = {
    ew: document.getElementById("english-words").checked,
    en: document.getElementById("english-names").checked,
    ec: document.getElementById("english-cities").checked,
    sw: document.getElementById("spanish-words").checked,
    fw: document.getElementById("french-words").checked,
  }
  if (!p.ew && !p.en && !p.ec && !p.sw && !p.fw) return $('body').toast({message:'Please select a database to pull from!'});
  $('body').toast({message: 'Randomized!'});
  fetch("/mnemonic?ew="+p.ew+"&en="+p.en+"&ec="+p.ec+"&sw="+p.sw+"&fw="+p.fw)
    .then(response => response.json()) // parse the JSON from the server
    .then(mnemonic => {
      list.forEach(function(item, index) {
        let originDatabase = mnemonic[index].slice(0, 2);
        let originOutput;
        let newInnerText = mnemonic[index].slice(2);
        document.getElementById(item).innerText = newInnerText.replace(/^\w/, c => c.toUpperCase());
        switch(originDatabase) {
          case 'ew':
            originOutput = 'English Words';
            break;
          case 'en':
            originOutput = 'English Names';
            break;
          case 'ec':
            originOutput = 'English Cities';
            break;
          case 'sw':
            originOutput = 'Spanish Words';
            break;
          case 'fw':
            originOutput = 'French Words';
            break;
          default:
            originOutput = 'Unknown';
        }
        let tooltipsetter = list2[index] + " - " + originOutput;
        document.getElementById(item).setAttribute("data-tooltip", tooltipsetter);
      });
      if (justStarted) justStarted = false;
    });
}
function goToPage(id) {
  if (justStarted) return;
  let myElement = document.getElementById(id);
  window.open(
    "https://en.wiktionary.org/wiki/" + myElement.innerText.toLowerCase(),
    "_blank"
  );
}
