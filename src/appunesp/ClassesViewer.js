import React, { Component } from 'react';
import {AppRegistry,StyleSheet,
  TouchableOpacity,
  Text,View,FlatList,} from 'react-native';

import TweetItem from './classes_viewer/TweetItem';
import Pagination,{Icon} from 'react-native-pagination';
import _ from 'lodash';// if you dont have this then gtfo
import {MockTweetList} from './classes_viewer/FakerMocks';
import Dots from './classes_viewer/Dots'

export default class HorizontalPagedFlatListExample extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props){
		super(props);

		this.state = {
			items: MockTweetList,
			// selected: (new Map(): Map<string, boolean>),
		};
	}


	// REQUIRED for ReactNativePagination to work correctly
	onViewableItemsChanged = ({ viewableItems, changed }) => this.setState({viewableItems})
	
	_renderItem = ({item}) => {
		return (<TweetItem
		   index={item.id}
		   id={item.id}
		   onPressItem={this._onPressItem}
		   title={item.title}
		   city={item.city}
		   type={item.type}
		   color={item.color}
		   description={item.description}
		   image={item.image}
		/>)
	}
	render() {
		return (
			<View style={[s.container]}>
				<FlatList
					horizontal
					pagingEnabled
					ref={r=>this.refs=r}
					data={this.state.items}
					keyExtractor={(item, index) => item.id.toString()}//map your keys to whatever unique ids the have (mine is a "id" prop)
					renderItem={this._renderItem}
				/>
				<Dots/>

			</View>
		)
	}
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"grey",//<-- use with "dotThemeLight"
  },
});
