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

flog = (msg) => console.log(":::" + msg);  

import { SisgradCrawler } from './sisgrad/sisgrad_crawler.js';

const Sisgrad = new SisgradCrawler();
//flog("teste");
async function a() {
  ({$, header}      = await Sisgrad.load_login_page());
  //Do nothing, just loaded the page before to simulate user entering website
  //The pabe above has an HTML redirect to the page below:
  ({$, header, url} = await Sisgrad.perform_login());
  
  console.log('url: ' + url);
  //console.log('redirected: ' + x.redirected);  
  console.log($('form[name=formLogin]'));
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
