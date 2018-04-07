import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, ImageBackground } from 'react-native';
import Logo from './login_screen/components/Logo';
import Form from './login_screen/components/Form';
import Wallpaper from './login_screen/components/Wallpaper';
import ButtonSubmit from './login_screen/components/ButtonSubmit';
import SignupSection from './login_screen/components/SignupSection';
import Dimensions from 'Dimensions';
import bgSrc from './login_screen/images/wallpaper2.jpeg';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

export default class LoginScreen extends Component {
  render() {
    return (
      <ImageBackground style={styles.picture} source={bgSrc}>
        <KeyboardAvoidingView style={{flex:1, flexDirection: "column"}} behavior="padding">
           <Logo/>
           <Form style={{flex:4, flexDirection: "column", marginLeft: 10, marginRight:10}}/>
           <SignupSection/>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: null,
    height: null,
    //resizeMode: 'cover',
  },
});

