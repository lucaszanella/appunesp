import React, { Component } from 'react';
import MessagesViewer from './MessagesViewer';
import MessageViewer from './MessageViewer';
import LoginScreenView from "./LoginScreenView";
import LoginScreenView2 from "./LoginScreenViewer";

import { StackNavigator } from 'react-navigation';

export default StackNavigator(
    {
        Login: {
            screen: LoginScreenView2,
        },
        Messages: {
            screen: MessagesViewer,
        },
        Message: {
            screen: MessageViewer,
        },
    },
    {
        initialRouteName: 'Login',
    }
);