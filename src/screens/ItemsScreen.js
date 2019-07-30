import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, FlatList } from "react-native";
import { Icon, SearchBar, ListItem } from "react-native-elements";

export default class ItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      list: [
        {
          imageURL: "../../media/logo1.png",
          title: "Item 1",
          location: "London, UK",
          added_by: "John Doe",
          added_on: "19-03-25"
        },
        {
          imageURL: "../../media/logo1.png",
          title: "Item 1",
          location: "London, UK",
          added_by: "John Doe",
          added_on: "19-03-25"
        },
        {
          imageURL: "../../media/logo1.png",
          qrcodeURL: "../../media/qrcode.png",
          title: "Item 1",
          location: "London, UK",
          added_by: "John Doe",
          added_on: "19-03-25"
        }
      ]
    }
  }

  static navigationOptions = {
    header: null
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      onPress={() => {
        this.props.navigation.navigate("Item", { item });
      }}
      containerStyle={{ margin: 3, borderRadius: 5, padding: 10 }}
      title={item.title}
      titleStyle={{ fontSize: 18 }}
      subtitle={
        <View>
          <Text>Added by {item.added_by}</Text>
        </View>
      }
      rightSubtitle={
        <View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{item.added_on}</Text></View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Icon type="material" name="location-on" /><Text>{item.location}</Text></View>
        </View>
      }
      leftAvatar={{ source: require("../../media/logo1.png"), size: "medium" }}
    />
  );

  render() {
    const { search } = this.state;

    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
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
        <FlatList
          style={{ margin: 3 }}
          keyExtractor={this.keyExtractor}
          data={this.state.list}
          renderItem={this.renderItem}
        />
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
