import React, { Component } from 'react';
import MessagesViewer from './MessagesViewer';
import MessageViewer from './MessageViewer';
import LoginScreenView from "./LoginScreenView";
import { StackNavigator } from 'react-navigation';

export default StackNavigator({
  Home: {
    screen: MessageViewer,
  },
});