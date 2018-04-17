import React, { Component } from 'react';
import { List, ListItem, SearchBar, Avatar } from "react-native-elements";
import { SisgradCrawler, schemas as SisgradSchemas } from './sisgrad/sisgrad_crawler.js';
import { username, password } from './credentials.js';
import randomColorPicker from './utils/randomColorPicker'
import parseDate from './utils/parseDate'
import initials from './utils/initials'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    TouchableHighlight,
} from 'react-native';
const md5 = require("blueimp-md5");

//const Realm         = require('realm');
//const realm         = new Realm(SisgradSchemas);
const Sisgrad = new SisgradCrawler(username, password);

type Props = {};
export default class MessagesViewer extends Component<Props> {
    static navigationOptions = {
        title: 'Mensagens',
        headerStyle: {
            backgroundColor: '#3F51B5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };
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
        }
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
        Sisgrad.performLogin().
        //then(readMessages).
        then(updateMessages);
    }

    _onRefresh() {
        //this.setState({refreshing: true});
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#CED0CE",
            }}
          />
        );
    }

    goToMessageReader = (id) => {
        /* 1. Navigate to the Details route with params */
        this.props.navigation.navigate('Message', {
          id: id,
        })
    }

    renderItem = ({item}) => (
        <TouchableHighlight onPress={()=>this.goToMessageReader(item.id)} underlayColor='#FFFFFF'>
            <View style={styles.listItem}>
                <Avatar
                    medium
                    rounded
                    title={initials(item.sentBy)}
                    overlayContainerStyle={{backgroundColor: randomColorPicker(item.sentBy)}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
                <View style={{flex: 9, flexDirection: 'column'}}>
                    <Text style={styles.sentby}  numberOfLines={1}>{item.sentBy}</Text>
                    <Text style={styles.subject} numberOfLines={1}>{item.subject}</Text>
                    <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
                </View>
                <View style={styles.time}>
                    <Text style={styles.timeText}>{parseDate(item.sentDate)}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    data={this.state.data}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={this.renderItem}
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
        marginTop: 3
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
        fontWeight: '600'

    },
    sentby: {
        fontSize: 17,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
        fontWeight: '600'

       // color: 'rgba(255, 255, 255, 0.7)'
    },
    message: {
        fontSize: 12,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
        fontWeight: '400'

       // color: 'rgba(255, 255, 255, 0.7)'
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
