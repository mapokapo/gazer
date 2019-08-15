import React, { Component } from "react";
import { Text, View, StatusBar } from "react-native";
import firebase from "react-native-firebase";
import Header from "../components/Header";

export default class UserPanelScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedUserData: this.props.navigation.getParam("userData"),
      user: "",
      userData: "",
      getUser: firebase.functions().httpsCallable("getUser")
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: <Header userPanel userData={navigation.getParam("userData")} />,
      headerStyle: {
        backgroundColor: "#065471"
      },
      headerTintColor: "#fff"
    }
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
