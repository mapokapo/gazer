import React, { Component } from "react";
import { View, Text, RefreshControl, FlatList, StatusBar } from "react-native";
import { Icon, SearchBar, ListItem } from "react-native-elements";
import firebase from "react-native-firebase";
import { NavigationEvents } from "react-navigation";

export default class AdminControlPanelScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      userList: [],
      loading: true,
      userData: "",
      user: ""
    }
  }

  static navigationOptions = {
    header: null
  };

  fetchUsers = () => {
    firebase.database().ref("users/").on("value", snapshot => {
      if (!snapshot.val())
        return;
      let userArray = Object.values(snapshot.val());
      this.setState({ userList: userArray }, () => {
        this.setState({ loading: false });
      })
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) =>
    <ListItem
      onPress={() => {
        this.props.navigation.navigate("UserPanel", { user: item });
      }}
      containerStyle={{ margin: 3, borderRadius: 5, padding: 10 }}
      title={item.displayName}
      titleStyle={{ fontSize: 18 }}
      subtitle={
        <View>
          <Text style={{ color: "#444" }}>Joined on {item.joined}</Text>
        </View>
      }
      rightSubtitle={
        item.admin === 1 && <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
          <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" size={18} color="#9b59b6" name="grade" /><Text numberOfLines={1} style={{ color: "#333" }}>Admin</Text></View>
        </View>
      }
      rightContentContainerStyle={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
      leftAvatar={{ source: { uri: item.imageURL }, size: "medium" }}
    />

  updateSearch = search => {
    this.setState({ search }, () => {
      firebase.database().ref("users/").orderByChild("displayName").startAt(search.toUpperCase()).endAt(search.toLowerCase()+"\uf8ff").once("value", snapshot => {
        if (snapshot.val()) {
          this.setState({ list: Object.values(snapshot.val()) });
        }
      });
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <NavigationEvents
          onDidFocus={() => {
            this.fetchUsers()
            this.setState({ user: this.props.navigation.getParam("user") , userData: this.props.navigation.getParam("userData") });
          }}
        />
        <SearchBar
          lightTheme round
          placeholder="Search Users..."
          onChangeText={this.updateSearch}
          value={this.state.search}
          inputContainerStyle={{ backgroundColor: "#2980b9" }}
          inputStyle={{ color: "#fff" }}
          placeholderTextColor="#fff"
          searchIcon={<Icon type="material" name="search" color="#fff" />}
          containerStyle={{ backgroundColor: "#3498db", borderBottomColor: "transparent", borderTopColor: "transparent" }}
        />
        <FlatList
          style={{ margin: 3 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.fetchUsers}
            />
          }
          data={this.state.userList}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}
