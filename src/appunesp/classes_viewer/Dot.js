//import PropTypes from ‘prop-types’;
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default class Dot extends Component {

    /*
    static propTypes = {
      content: PropTypes.string.isRequired,
      textStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
      buttonStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
    }
    */
    render = () => {
        const { text } = this.props;
        horizontal=true;
        return (
            <View style={{}}>
                <Text style={s.text}>{text}</Text>
            </View>
        );
    }
}
const s = StyleSheet.create({
    text: {
        flex: 1,
        color:"white",
    },
});
  