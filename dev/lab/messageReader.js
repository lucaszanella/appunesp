const cheerio = require("cheerio");
const cheerioTableparser = require('cheerio-tableparser');
clean  = string => string.replace(/[ \t\n]+/g,' ').trim(); //removes extra whitespace


var fs = require('fs');
read = (page) => {
  fs.readFile(page, function (err, data) {
    if (err) {
      throw err; 
    }
    $ = cheerio.load(data.toString());
    cheerioTableparser($);
    form        = $('form[name=form_email]');
    table       = $('table', form).first().parsetable(false, false, false);
    sender      = table[1][1];
    subject     = table[1][2];
    sentDate    = table[1][3];
    message     = "";
    
    if (table[0].length==7) { //The easiest way to detect if the table contains attachments or not
      attachments = table[1][4];
      attachments = $('a', attachments).toArray();
      attachments = attachments.map(x => $(x));
      attachments = attachments.map(x => (
            {
              link : x.attr('href'), 
              title: clean(x.text())
            }
      ));
      message     = clean($(table[0][5]).text());
    } else if (table[0].length==6){
      message     = clean($(table[0][4]).text());
    }

    console.log(subject);
    //console.log(attachments);
  });
}
[1,2,3,4].map(x=>`message${x}.html`).forEach(read)
