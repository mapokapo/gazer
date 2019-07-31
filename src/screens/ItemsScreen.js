import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, RefreshControl, FlatList } from "react-native";
import { Icon, SearchBar, ListItem, Button } from "react-native-elements";
import firebase from "react-native-firebase";
import { NavigationEvents } from "react-navigation";

export default class ItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      list: [],
      loading: true
    }
  }

  static navigationOptions = {
    header: null
  };

  fetchItems = () => {
    firebase.database().ref("items").on("value", snapshot => {
      if (!snapshot.val()) {
        return
      }
      let itemArray = Object.values(snapshot.val());
      this.setState({ list: itemArray }, () => {
        this.setState({ loading: false });
      })
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) =>
    <ListItem
      onPress={() => {
        this.props.navigation.navigate("Item", { item });
      }}
      containerStyle={{ margin: 3, borderRadius: 5, padding: 10 }}
      title={item.title}
      titleStyle={{ fontSize: 18 }}
      subtitle={
        <View>
          <Text style={{ color: "#444" }}>Added by {item.added_by}</Text>
        </View>
      }
      rightSubtitle={
        <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
          <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" name="date-range" /><Text numberOfLines={1}>{item.added_on}</Text></View>
          <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" name="location-on" color="#E84B3D" /><Text style={{ overflow: "hidden" }}>{item.location}</Text></View>
        </View>
      }
      rightContentContainerStyle={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
      leftAvatar={{ source: { uri: item.imageURL }, size: "medium" }}
    />

  render() {
    const { search } = this.state;

    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <NavigationEvents
          onDidFocus={() => {
            this.fetchItems();
          }}
        />
        <SearchBar
          lightTheme round
          placeholder="Search Items..."
          onChangeText={this.updateSearch}
          value={search}
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
              onRefresh={this.fetchItems}
            />
          }
          data={this.state.list}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
        <Button
          onPress={() => {
            this.props.navigation.navigate("AddItem");
          }}
          buttonStyle={styles.FloatingActionButton}
          icon={
            <Icon type="material" name="add" color="#222" size={35} />
          }
        />
      </View>
    );
  }

  updateSearch = search => {
    this.setState({ search }, () => {
      firebase.database().ref("items/").orderByChild("searchQuery").startAt(search.toLowerCase()).endAt(search.toLowerCase()+"\uf8ff").on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({ list: Object.values(snapshot.val()) });
        }
      });
    });
  };

  _showMoreApp = () => {
    this.props.navigation.navigate("Home");
  };
}

const DEVICE_WIDTH = Dimensions.get(`window`).width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: "#0097a7"
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    width: DEVICE_WIDTH,
    height: 56,
    marginBottom: 6,
    backgroundColor: "#00bcd4"
  },
  label: {
    flexGrow: 1,
    fontSize: 20,
    fontWeight: `600`,
    textAlign: `left`,
    marginVertical: 8,
    paddingVertical: 3,
    color: `#f5fcff`,
    backgroundColor: `transparent`
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 130,
    height: 40,
    marginTop: 40,
    borderRadius: 2,
    backgroundColor: `#ff5722`,
  },
  FloatingActionButton: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: "#2ecc71",
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 500,
    shadowColor: "#222",
    elevation: 2
  }
});