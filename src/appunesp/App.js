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

const Sisgrad = new SisgradCrawler(username, password);
const messagesTable = 'messages' + 'v4';

/*
async function login(username, password) {
  console.log('initiating login...');
  l = await Sisgrad.performLogin(username, password);
  l ? console.log('logged in!') : null;
  l = await Sisgrad.readMessages();
  return l;
}

async function readMessages() {
  l = await Sisgrad.readMessages();
}

async function readMessage(id) {
  l = await Sisgrad.readMessage(id);
}
*/

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

messagesSchema = {
  name: messagesTable, 
  primaryKey: 'id',
  properties: {
    id             : 'string',
    favorite       : 'string',
    hasAttachment  : 'string',
    sentBy         : 'string',
    subject        : 'string',
    sentDate       : 'string',
    readDate       : 'string',
    sisgradId      : 'string',
    message        : 'string',
  }
}

const schemas = {
  schema: [messagesSchema]
}

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
    Realm.open(schemas).then(realm => {
      console.log('realm loaded');
      this.setState({ realm });
      this.setState({ data: realm.objects(messagesTable)});
    });
  }

  componentDidMount() {
    console.log("componentDidMount")

	writeMsgs  = (realm, messages) => () => {
		record = message => {
			console.log('going to record')
			console.log(message)
			id = md5(message.sisgradId + message.subject)
			doc =  {id             : id                   ,
					favorite       : message.favorite     ,
					hasAttachment  : message.hasAttachment,
					sentBy         : message.sentBy       ,
					subject        : message.subject      ,
					sentDate       : message.sentDate     ,
					readDate       : message.readDate     ,
					sisgradId      : message.sisgradId    ,
					message        : 'message example'    ,}
			if (realm.objects(messagesTable).filtered('id = "' + id + '"').length==0)
				realm.create(messagesTable, doc)
		}
		//Sisgrad.readMessages().then(messages => messages.map(record))
		messages.map(record);
		this.setState( { loading: false, refreshing: false } )
	}
    //realmWrite = realm => realm.write(writeMsgs(realm))
	realmWriteMessages = messages => 
		Realm.open(schemas).then(realm => 
			realm.write(writeMsgs(realm, messages)
		)
	)
    Sisgrad.performLogin().then(Sisgrad.readMessages().then(realmWriteMessages))
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
            
		   /*
           <ListItem
            roundAvatar
            title={item.subject}
            subtitle={
              <View>
                <Text style={styles.sentby}>{item.sentBy}</Text>
              </View>
            }
            //avatar={require('../images/avatar1.jpg')}
			/>
			*/
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
