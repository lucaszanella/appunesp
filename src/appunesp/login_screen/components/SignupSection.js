import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {StyleSheet, View, Text} from 'react-native';

export default class SignupSection extends Component {
  render() {
    return (
      <View style={{...StyleSheet.flatten(styles.container), ...this.props.style ? StyleSheet.flatten(this.props.style) : {} }}>
        <Text style={styles.text}>Create Account</Text>
        <Text style={styles.text}>Forgot Password?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});
