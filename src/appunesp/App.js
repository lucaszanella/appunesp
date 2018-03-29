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
  View,
  FlatList,
} from 'react-native';
import { List, ListItem, SearchBar } from "react-native-elements";
import { SisgradCrawler } from './sisgrad/sisgrad_crawler.js';
import { username, password } from './credentials.js';
const md5 = require("blueimp-md5");
const Realm = require('realm');
//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
//const cheerioTableparser = require('cheerio-tableparser');

const Sisgrad = new SisgradCrawler();
async function login(username, password) {
  console.log('initiating login...');
  l = await Sisgrad.performLogin(username, password);
  l ? console.log('logged in!') : null;
  l = await Sisgrad.readMessages();
  return l;
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const schemas = [
  {
    name: 'messages', 
    primaryKey: 'id',
    properties: {
      id             : 'string',
      favorite       : 'string',
      hasAttachment  : 'string',
      sentBy         : 'string',
      subject        : 'string',
      sentDate       : 'string',
      readDate       : 'string'
    }
  }
];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      realm: null,
      messages: null
    };

  }

  componentWillMount() {
    Realm.open({
      schema: schemas
    }).then(realm => {
      console.log('realm loaded');
      this.setState({ realm });
      this.setState({ data: realm.objects('messages')});
    });
  }

  componentDidMount() {
    console.log("componentDidMount----------------------------------------");
    console.log(this.state.realm);

    login(username, password).then(messages => {
      Realm.open({schema: schemas}).then(realm => {
        //realm.deleteAll();
        //let allMessages = realm.objects('message');realm.delete(allMessages);

        realm.write(() => {
          //realm.deleteAll();
          //console.log(realm.objects('messages'))

          for (message of messages) {
            id = md5(message.favorite      +
                     message.hasAttachment +
                     message.sentBy        +
                     message.subject       + 
                     message.sentDate      + 
                     message.readDate)
            if (realm.objects('messages').filtered('id = "'+id+'"').length==0) {
              console.log('object did not previously exist, creating now');
              console.log('object is ' + message.subject + ". Adding it...");
              realm.create('messages', {
                id             : id                   ,
                favorite       : message.favorite     ,
                hasAttachment  : message.hasAttachment,
                sentBy         : message.sentBy       ,
                subject        : message.subject      ,
                sentDate       : message.sentDate     ,
                readDate       : message.readDate     ,
              })
            }
          }
          
        })
      })
      
      this.setState({
        //data: x,
        loading: false,
        refreshing: false
        })
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
            Unesp
        </Text>
        <FlatList
         data={this.state.data}
         renderItem={({item}) => 
           (
            <View style={{flex: 1, flexDirection: 'column', marginBottom:5}}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.sentby}>{item.sentBy}</Text>
            </View>
           )
          }
          keyExtractor={item => item.subject+item.sentby+item.sentDate}
        />
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
  subject: {
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,

  },
  sentby: {
    fontSize: 10,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
    },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
