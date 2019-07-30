import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, Animated, FlatList } from "react-native";
import { Icon, SearchBar, ListItem } from "react-native-elements";
import firebase from "react-native-firebase";
import { NavigationEvents } from "react-navigation";

export default class ItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      list: [],
      loading: true,
      loadingListItemOpacity: new Animated.Value(0)
    }
  }

  static navigationOptions = {
    header: null
  };

  runAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.loadingListItemOpacity, {
          toValue: 0.3,
          duration: 500
        }),
        Animated.timing(this.state.loadingListItemOpacity, {
          toValue: 0,
          duration: 500
        })
      ])
    ).start();
  }

  fetchItems = () => {
    this.runAnimation();
    firebase.database().ref("items").on("value", snapshot => {
      if (!snapshot.val()) {
        return
      }
      let itemArray = Object.values(snapshot.val());
      this.setState({ list: itemArray }, () => {
        Animated.timing(
          this.state.loadingListItemOpacity
        ).stop();
        this.setState({ loading: false });
      })
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderShadowItem = ({ item }) =>
    <Animated.View style={{ opacity: this.state.loadingListItemOpacity }}>
      <ListItem
        containerStyle={{ margin: 10, borderRadius: 5, padding: 15, backgroundColor: "#222"}}
      />
    </Animated.View>

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
        <View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}><Icon type="material" name="date-range" /><Text>{item.added_on}</Text></View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}><Icon type="material" name="location-on" color="#E84B3D" /><Text>{item.location}</Text></View>
        </View>
      }
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
          onFocus={() => {
            alert("asd");
          }}
        />
        {this.state.loading ?
          <View>
            <FlatList
              style={{ margin: 3 }}
              keyExtractor={this.keyExtractor}
              data={[1, 2, 3]}
              renderItem={this.renderShadowItem}
            />
          </View>
          :
          <FlatList
            style={{ margin: 3 }}
            keyExtractor={this.keyExtractor}
            data={this.state.list}
            renderItem={this.renderItem}
          />
        }
      </View>
    );
  }

  updateSearch = search => {
    this.setState({ search });
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
    backgroundColor: `#ff5722`
  }
});
