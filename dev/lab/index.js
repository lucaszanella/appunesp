const cheerio = require("cheerio");
const cheerioTableparser = require('cheerio-tableparser');

var fs = require('fs');
fs.readFile('./messages.html', function (err, data) {
  if (err) {
    throw err; 
  }
  //console.log(data.toString());
  $ = cheerio.load(data.toString());
  cheerioTableparser($);
  table = $('#destinatario').parsetable(false, false, true);
  console.log(table[1][1])  

});