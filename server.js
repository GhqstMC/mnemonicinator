// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const Enmap = require("enmap");
let importNames = require("./names.js");
let importWords = require("an-array-of-english-words");
const checkArray = [
  "aaa",
  "eae",
  "aii",
  "eio",
  "aee",
  "aoo",
  "aai",
  "iai",
  "eao",
  "oao"
];
const list = [
  "aaa",
  "eae",
  "aii",
  "eio",
  "eae",
  "aee",
  "eio",
  "aoo",
  "aai",
  "iai",
  "aii",
  "eao",
  "oao",
  "eio",
  "aai",
  "aee",
  "iai",
  "eao",
  "eio"
];
const db = {
  english: {
    words: new Enmap({ name: "english-words" }),
    names: new Enmap({ name: "english-names" }),
    cities: new Enmap({ name: "english-cities" })
  },
  spanish: {
    words: new Enmap({ name: "spanish-words" }),
    names: new Enmap({ name: "spanish-names" })
  },
  french: {
    words: new Enmap({ name: "french-words" }),
    names: new Enmap({ name: "french-names" })
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//console.log(db.english.names.get("aaa"));
//addToDB(importWords, "english", "words");
function addToDB(inputArray, targetLang, targetDatabase) {
  inputArray.forEach(function(input, index) {
    input = input.toLowerCase();
    input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let inputVowels = input.replace(/[^aeiouy]/gi, "");
    if (!inputVowels.length === 3) return;
    if (checkArray.includes(inputVowels)) {
      db[targetLang][targetDatabase].push(inputVowels, input);
    }
  });
}
function makeArray(ew, en, ec, sw, sn, fw, fn) {
  let output = [];
  let $ = initObj();
  console.log(en);
  checkArray.forEach(function(item, index) {
    if (ew) $[item].push(...db.english.words.get(item));
    if (en) $[item].push(...db.english.names.get(item));
    if (ec) $[item].push(...db.english.cities.get(item));
    if (sw) $[item].push(...db.spanish.words.get(item));
    if (sn) $[item].push(...db.spanish.names.get(item));
    if (fw) $[item].push(...db.french.words.get(item));
    if (fn) $[item].push(...db.french.names.get(item));
  });

  list.forEach(function(item, index) {
    let originDatabase;
    let localWord = $[item][getRandomInt(0, $[item].length)];
    let englishWords = db.english.words.get(item);
    let englishNames = db.english.names.get(item);
    if (englishWords.includes(localWord)) originDatabase = 'ew';
    if (englishNames.includes(localWord)) originDatabase = 'en';
    output.push(originDatabase + localWord);
  });
  return output;
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/mnemonic", (req, response) => {
  // express helps us take JS objects and send them as JSON
  console.log(
    "Recieved a request with queries ew: " +
      req.query.ew +
      " en: " +
      req.query.en +
      " ec: " +
      req.query.ec +
      " sw: " +
      req.query.sw +
      " sn: " +
      req.query.sn +
      " fw: " +
      req.query.fw +
      " fn: " +
      req.query.fn +
      "."
  );
  response.json(
    makeArray(
      req.query.ew,
      req.query.en,
      req.query.ec,
      req.query.sw,
      req.query.sn,
      req.query.fw,
      req.query.fn
    )
  );
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

function initObj() {
  let obj = {};
  checkArray.forEach(function(item, index) {
    obj[item] = [];
  });
  return obj;
}
/*checkArray.forEach(function(item, index) {
  db.english.words.set(item, []);
  db.english.names.set(item, []);
  db.english.cities.set(item, []);
  db.spanish.words.set(item, []);
  db.spanish.names.set(item, []);
  db.french.words.set(item, []);
  db.french.names.set(item, []);
});*/
