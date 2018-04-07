import React, { Component } from 'react';
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { SisgradCrawler, schemas as SisgradSchemas } from './sisgrad/sisgrad_crawler.js';
import { username, password } from './credentials.js';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
} from 'react-native';
//const Realm         = require('realm');
//const realm         = new Realm(SisgradSchemas);
const Sisgrad = new SisgradCrawler(username, password);

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
        this.setState(
            { 
                data: Sisgrad.messagesFromRealm() 
            }
        )
    }

    componentDidMount() {
        console.log("componentDidMount");

        updateMessages = () => {
            console.log('updating messages');
            Sisgrad.updateMessages()
        }

        writeMessages = messages => {
            this.setState( { loading: false, refreshing: false } )
            for (message of messages)
                Sisgrad.recordMessage(message);
        }
        readMessages = () => Sisgrad.readMessages().then(writeMessages);
        //Sisgrad.performLogin().then(readMessages).then(updateMessages);
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
    };

    initials = name => {
        x = name.split(" ", 2);
        if (x.length>=2)
          return x[0][0]+x[1][0]
        else if (x.length==1)
          return x[0][0]
        else 
          return "__";
      };
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Unesp
                </Text>
                <FlatList
                data={this.state.data}
                ItemSeparatorComponent={this.renderSeparator}
                renderItem={
                    ({item}) => (
                        <View style={styles.listItem}>
                            
                            <Avatar
                                medium
                                rounded
                                title={this.initials(item.sentBy)}
                                onPress={() => console.log("Works!")}
                                activeOpacity={0.7}
                                />
                            <View style={{flex: 9, flexDirection: 'column'}}>
                                <Text style={styles.sentby} >{item.sentBy}</Text>
                                <Text style={styles.subject} >{item.subject}</Text>
                            </View>
                            <View style={styles.time}>
                                <Text style={styles.timeText} >14h</Text>
                            </View>
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
        backgroundColor: '#FFFFFF',
    },
    listItem: {
        flex:1,
        flexDirection: 'row',
        marginLeft:5,
        marginRight:5,
        marginBottom:7,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    subject: {
        fontSize: 12,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
    },
    sentby: {
        fontSize: 17,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
    },
    time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',  
        marginRight: 3,
        marginTop:3
    },
    timeText:{
        fontSize: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
