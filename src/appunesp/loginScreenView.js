import React, {Component} from 'react';
import Logo from 'login_screen/components/Logo';
import Form from 'login_screen/components/Form';
import Wallpaper from 'login_screen/components/Wallpaper';
import ButtonSubmit from 'login_screen/components/ButtonSubmit';
import SignupSection from 'login_screen/components/SignupSection';

export default class LoginScreen extends Component {
  render() {
    return (
      <Wallpaper>
        <Logo />
        <Form />
        <SignupSection />
        <ButtonSubmit />
      </Wallpaper>
    );
  }
}
