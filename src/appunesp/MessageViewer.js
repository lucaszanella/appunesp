import React, { Component } from 'react';
import { Text, View } from 'react-native';
import randomColorPicker from './utils/randomColorPicker'
import parseDate from './utils/parseDate'


export default class MessageViewer extends Component {
  render() {
    return (
      <View>
        <Text style={styles.subject} numberOfLines={1}>{item.subject}</Text>
        <View style={styles.listItem}>
            <Avatar
                medium
                rounded
                title={this.initials(item.sentBy)}
                overlayContainerStyle={{backgroundColor: randomColorPicker(item.sentBy)}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
            />
            <View style={{flex: 9, flexDirection: 'column'}}>
                <Text style={styles.sentby}  numberOfLines={1}>{item.sentBy}</Text>
                <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            </View>
            <View style={styles.time}>
                <Text style={styles.timeText}>{parseDate(item.sentDate)}</Text>
            </View>
        </View>
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