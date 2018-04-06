const cheerio = require("cheerio");
const cheerioTableparser = require('cheerio-tableparser');
clean  = string => string.replace(/[ \t\n]+/g,' ').trim(); //removes extra whitespace


var fs = require('fs');
fs.readFile('./message2.html', function (err, data) {
  if (err) {
    throw err; 
  }
  $ = cheerio.load(data.toString());
  cheerioTableparser($);
  form        = $('form[name=form_email]');
  table       = $('table', form).first().parsetable(false, false, false);
  message     = clean($(table[0][5]).text());
  attachments = table[1][4];
  attachments = $('a', attachments).toArray();
  console.log($(attachments[1]).attr('href'));
  attachments = attachments.map(x => $(x));
  attachments = attachments.map(x => (
        {
          link : x.attr('href'), 
          title: clean(x.text())
        }
  ));
  sender   = table[1][1];
  subject  = table[1][2];
  sentDate = table[1][3];

  console.log(message);
  console.log(attachments);
});