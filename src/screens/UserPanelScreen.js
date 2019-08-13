import React, { Component } from "react";
import { Text, View, StatusBar } from "react-native";

export default class UserPanelScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#065471"
    },
    headerTintColor: "#fff"
  };

  render() {
    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <Text> textInComponent </Text>
      </View>
    );
  }
}
