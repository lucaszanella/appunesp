import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { SisgradCrawler } from './sisgrad/sisgrad_crawler.js';

const Sisgrad = new SisgradCrawler();

async function login(username, password) {
    console.log('initiating login...');
    l = await Sisgrad.performLogin(username, password);
    l ? console.log('logged in!') : null;
    l = await Sisgrad.readMessages();
    return l;
}

class MessagesViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [{
        favorite       : '',
        hasAttachment  : '',
        sentBy         : 'lucas zanella',
        subject        : 'assunto',
        sentDate       : '01/01/01',
        readDate       : '01/01/02'
      }],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      ready: false
    };
  }

  componentDidMount() {
    this.setState({ ready: true, loading: true });
    l = login(username, password);
    this.setState({loading: false, data: l});
  }
/*
  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    //const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
*/
/*
  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
*/
  render() {
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={`${item.sentBy}`}
              subtitle={item.subject}
              //avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          /*
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
          */
        />
      </List>
    );
  }
}

export default MessagesViewer;
