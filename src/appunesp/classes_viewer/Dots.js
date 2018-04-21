//import PropTypes from ‘prop-types’;
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Dot from './Dot';

export default class Dots extends Component {

    data = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(x=>(<Dot text={x}/>));
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
        const { textStyles, buttonStyles, content } = this.props;
        horizontal=true;
        width=40;
        height=30;
        return (
            <View style={[
                {
                    flex:1,
                    marginTop:(horizontal===true)?0:20,
                    marginBottom:(horizontal===true)?0:20,
                    marginLeft:(horizontal===true)?5:0,
                    marginRight:(horizontal===true)?5:0,
                    height:(horizontal===false)?height:30,
                    position: 'absolute',
                    bottom:10,
                    left: 0,
                    right: 0,
                    zIndex:99,
                    flexDirection: (horizontal==true)?"row":"column",
                    justifyContent: 'space-between',alignItems:"center"
                },]}>
                {this.data}
            </View>
        );
    }
  }
  