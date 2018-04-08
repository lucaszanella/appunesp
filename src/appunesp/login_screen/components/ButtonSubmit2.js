import React, {Component} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import mergeObjects from '../../utils/mergeObjects'
import eyeImg from '../images/eye_black.png';

export default class UserInput extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
            buttonW: 1
        };
    }
    render() {
        return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={1}>
                {this.state.isLoading ? (
                    <Image source={spinner} style={styles.image} />
                ) : (
                    <Text style={styles.text}>{this.props.placeholder}</Text>
                )}
            </TouchableOpacity>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {

  },
  button: {
    backgroundColor: '#99ccff',
    borderRadius: 20,
    height:50,
    alignItems:'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight:"300",
  }
});
