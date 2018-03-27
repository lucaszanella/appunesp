const cheerio = require("cheerio");
const cheerioTableparser = require('cheerio-tableparser');


pickLargest = function(context, selector) {

}

parseForm = function (form) {

}

var fs = require('fs');
fs.readFile('./login.html', function (err, data) {
  if (err) {
    throw err; 
  }
  //console.log(data.toString());
  $ = cheerio.load(data.toString());
  //cheerioTableparser($);
  //console.log($);

  forms = $('form');
  var login_form = null;

  if (forms.lenght == 0)
    console.log('zero')
  else if (forms.length == 1)
    login_form = forms.first()
  else if (t = $('form[name=formLogin]').lenght)
    login_form = t
  
  login = login_form.serializeArray();
  console.log(login_form.val('action'));
  console.log(login_form.html())
  console.log(login)
  serialized = ""

  login.map((item) => {
    if (item.name=='txt_usuario')
      item.value = 'username'
    if (item.name=='txt_senha')
      item.value = 'password'
    return item;
  }).map((item) => {
    serialized += "&" + item.name + "=" + item.value;
  });
  serialized = serialized.substr(1, serialized.length);//removes first '&'
  //console.log(serialized);
  //console.log(login_form);
  //console.log(login_form.val('action'));


});