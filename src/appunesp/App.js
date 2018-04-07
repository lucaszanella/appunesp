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
        Sisgrad.performLogin().then(readMessages).then(updateMessages);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Unesp
                </Text>
                <FlatList
                data={this.state.data}
                renderItem={
                    ({item}) => (
                        <View style={styles.listItem}>
                            
                            <Avatar
                                medium
                                rounded
                                title="MT"
                                onPress={() => console.log("Works!")}
                                activeOpacity={0.7}
                                />
                            <View style={{flex: 6, flexDirection: 'column', marginBottom:5}}>
                                <Text style={styles.subject} >{item.subject}</Text>
                                <Text style={styles.sentby} >{item.sentBy}</Text>
                            </View>
                        </View>
                        
                    /*s
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
        backgroundColor: '#F5FCFF',
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
