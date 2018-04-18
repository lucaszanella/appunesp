import React, {Component} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Button from 'apsl-react-native-button'

import UserInput from './UserInput';
import ButtonSubmit2 from './ButtonSubmit2';

import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  render() {
    return (
      <View style={this.props.style}>
        <UserInput
          containerStyle={styles.textInputContainer}
          style={styles.textInput}
          source={usernameImg}
          placeholder="e-mail"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <UserInput
          containerStyle={styles.textInputContainer}
          style={styles.textInput}
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder="senha"
          returnKeyType={'done'}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <Button style={styles.buttonStyle5} textStyle={styles.textStyle6}>LOGIN </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer : {
        marginBottom: 20
  },
  textInput: {
    flex:1,
    height: 50,
  },
  textStyle6: {
    color: 'white',
  },
  buttonStyle5: {
    borderColor: '#2980b9',
    backgroundColor: '#3498db'
  },
});