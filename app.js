const express = require('express');
const app = express();
const fetch = require("node-fetch");

var count = 0;
var itemDb = [];
const baseString = "https://xivapi.com"

function populateDb(data, count) {
  //let baseH = count - 1;
  //baseH = baseH * 100;
  data.forEach(element => {
      //baseH++;
      //$("#amt-queried").text(" Queried " + baseH + " items.");
      itemDb.push(element);
  });
}

async function createDb(count) {
  if (count < 97) {
    console.log("fetching");
    fetch(baseString+"/search?indexes=item&filters=ItemSearchCategory.ID>=9&page="+count)
        .then(res => res.json())
        .then(res => {
            count++;
            populateDb(res["Results"], count);
            createDb(count);
            if (count == 97) { 
            }
        })
        .catch(err => {
            console.log("failed call: " + count + ", with error: " + err);
        })
  }
  if (count == 97) {
    console.log(itemDb);
    var fs = require('fs');
    fs.writeFile ("input.json", JSON.stringify(itemDb), function(err) {
      if (err) throw err;
      console.log('complete');
    });
  }
}

app.get('/', function (req, res) {
  res.render("index");
  createDb(count);
});
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});