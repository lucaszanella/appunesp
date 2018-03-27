/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SisgradCrawler } from './sisgrad/sisgrad_crawler.js';
import { username, password } from './credentials.js';

//const cheerioTableparser = require('cheerio-tableparser');

flog = (msg) => console.log(":::" + msg);  

const Sisgrad = new SisgradCrawler();
//flog("teste");
async function a() {
  ({$, header}      = await Sisgrad.load_login_page());
  //Do nothing, just loaded the page before to simulate user entering website
  //The pabe above has an HTML redirect to the page below:
  ({$, header, url} = await Sisgrad.perform_login_page());
  forms = $('form');
  var login_form = null;

  if (forms.lenght == 0)
    console.log('zero')
  else if (forms.length == 1)
    login_form = forms.first()
  else if (t = $('form[name=formLogin]').lenght)
    login_form = t
  
  console.log(login_form.html())

  login = login_form.serializeArray();
  console.log('login:')
  console.log(login)
  serialized = "";

  login.map(item => {
    if (item.name=='txt_usuario')
      item.value = username
    if (item.name=='txt_senha')
      item.value = password
    return item;
  }).   map(item => 
    serialized += "&" + item.name + "=" + item.value
  );

  serialized = serialized.substr(1, serialized.length); //removes first '&'

  console.log(login_form.val('action'));
  console.log('serialized: ' + serialized);
  ({$, header, url} = await Sisgrad.perform_login(url       = login_form.val('action'),
                                                  form_data = serialized));
  
  console.log('done');
  //console.log(url);
  //console.log($('body').text());
  //cheerioTableparser($);
  //console.log('url: ' + url);
  //console.log('redirected: ' + x.redirected); 
  //login_form = $('form[name=formLogin]');
  //inputs     = login_form('input') 
  //console.log($('form[name=formLogin]'));
  //console.log($('form[name=formLogin]'));

};
a();

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
