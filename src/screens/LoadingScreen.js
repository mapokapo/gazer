import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import firebase from "react-native-firebase";

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    let data = this.props.navigation.getParam("data");
    if (data) {
      this.props.navigation.navigate("Item", { item: data })
    } else {
      firebase.auth().onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? "App" : "Login");
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#065471" }}>
        <ActivityIndicator size="large" color="#f39c12" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}