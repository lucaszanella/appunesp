import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Alert,
  View,
} from 'react-native';

import spinner from '../images/loading.gif';

const MARGIN = 40;

export default class ButtonSubmit extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      buttonW: 1
    };

    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    if (this.state.isLoading) return;

    this.setState({isLoading: true});
    /*
    Animated.timing(this.buttonAnimated, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start();
    */
    Animated.timing(                    // Animate over time
      this.state.buttonW,             // The animated value to drive, this would be a new Animated.Value(0) object.
      {
        toValue: 0,                   // Animate the value
        duration: 200,                 // Make it take a while
        easing: Easing.linear,
      }
    ).start();

    setTimeout(() => {
      this._onGrow();
    }, 2000);

    setTimeout(() => {
      this.setState({isLoading: false});
      this.growAnimated.setValue(0);
    }, 2300);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[{
            transform: [
              { scaleX: this.state.buttonW } // this would be the result of the animation code below and is just a number.
            ]
          }]}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onPress}
            activeOpacity={1}>
            {this.state.isLoading ? (
              <Image source={spinner} style={styles.image} />
            ) : (
              <Text style={styles.text}>{this.props.placeholder}</Text>
            )}
          </TouchableOpacity>
          {this.state.isLoading ? (
          <Animated.View
            style={[styles.circle, {transform: [{scale: changeScale}]}]}//TODO: fix this, what is this for?
          />
          ):null}
 
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:400,
    flexDirection: "row",
    alignItems:'center' 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99ccff',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#99ccff',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#99ccff',
  },
  text: {
    color: 'black',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },
});
