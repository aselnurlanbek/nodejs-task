const express = require("express");
const http = require("http");
const fs = require("fs");
const dateFormat = require('dateformat')
const moment = require('moment');

moment.locale('ru')
const app = express();

app.set("view engine", "ejs");

let news = [];
let phrases = [];
let waitNews = false;
let waitPhrase = false;

const newsReq = http.get("http://slowpoke.desigens.com/json/1/7000", (res) => {
  res.on("data", (data) => {
    waitNews = true;
    news = JSON.parse(data);
    news.forEach((obj)=>{
      obj.ptime =  moment(obj.ptime).format('DD MMMM YYYY')
    }
    )
   
  });
});



const phraseReq = http.get(
  "http://slowpoke.desigens.com/json/2/3000",
  (res) => {
    res.on("data", (data) => {
      waitPhrase = true;
      phrases = JSON.parse(data);
    });
  }
);

newsReq.on("error", (error) => {
  fs.appendFile("errors.log", error + "\n", (err) => {
    if (err) {
      alert(err);
    }
  });
});

phraseReq.on("error", (error) => {
  fs.appendFile("errors.log", error + "\n", (err) => {
    if (err) {
      alert(err);
    }
  });
});

setTimeout(() => {
  if (!waitNews) {
    fs.appendFile(
      "errors.log",
      " не дождались новостей" + "\n",
      function (err, data) {
        if (err) console.log(err);
      }
    );

    if (!waitPhrase) {
      fs.appendFile(
        "errors.log",
        " не дождались фраз" + "\n",
        function (err, data) {
          if (err) console.log(err);
        }
      );
    }
  }
}, 6000);

app.listen(3000);

app.get("/", (req, res) => {
  res.render("index", { news, phrases });
});
