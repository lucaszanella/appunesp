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
  table = $('#destinatario').parsetable(false, false, false);
 // x = $('a', table[3][2]).attr('href');
  //c = /VisualizarMensagem\('(\d+)'\)/.exec($('a', table[3][2]).attr('href'))[1]
  console.log($(table[3][2]).text())
  //console.log($('', table[3][2]))  

});