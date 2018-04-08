import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, ImageBackground, Image } from 'react-native';
import { Form, Logo, Wallpaper, SignupSection } from './login_screen';
import Dimensions from 'Dimensions';
import bgSrc from './login_screen/images/wallpaper2.jpeg';


export default class LoginScreen extends Component {
  render() {
    return (
      <ImageBackground style={styles.background} source={bgSrc}>
        <KeyboardAvoidingView style={{flex:1, flexDirection: "column"}} behavior="padding">
          <Logo style={{flex: 6,
                        alignItems: 'center',
                        justifyContent: 'center',}}>
          </Logo>
          <Form style={{flex:4,
                         flexDirection: "column", 
                         alignSelf:"flex-start",
                         marginLeft: 10, 
                         marginRight:10}}/>
          <SignupSection style={{flex:1}}/>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: null,
    height: null,
    //resizeMode: 'cover',
  },
  logoImage: {
    width: 150,
    height: 140,
  },
});

