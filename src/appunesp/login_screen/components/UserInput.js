import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Image, TouchableOpacity} from 'react-native';
import mergeObjects from '../../utils/mergeObjects'
import eyeImg from '../images/eye_black.png';

export default class UserInput extends Component {
  render() {
    return (
      <View style={styles.inputWrapper}>
        <Image source={this.props.source} style={styles.inlineImg} />
        <TextInput
          //style={styles.input}
          style={mergeObjects(this.props.style ? StyleSheet.flatten(this.props.style) : {}, StyleSheet.flatten(styles.input))}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
        />
            {this.props.secureTextEntry ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.btnEye}
                onPress={()=>null}>
                <Image source={eyeImg} style={styles.iconEye} />
              </TouchableOpacity>
            ) : (
              null
            )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    color: '#ffffff',
  },
  btnEye: {
    position: "absolute",
    right: 30
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems:'center' 
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
  },
});
