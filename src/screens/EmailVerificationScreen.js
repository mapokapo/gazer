import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text
} from "react-native";
import firebase from "react-native-firebase";

export default class EmailVerificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: 165,
      data: ""
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    let self = this;
    self.setState({ data: self.props.navigation.getParam("data") } ,() => {
      firebase.auth().currentUser.sendEmailVerification().then(() => {
        setTimeout(() => {
          self.props.navigation.navigate("Loading");
        }, 5000);
      });
    });
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <View
          style={
            styles.logoContainer
          }
        >
          <Image
            style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
            source={{ uri: this.state.data.imageURL}}
          />
        </View>
        <View style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>A Verification Email has been sent to <Text style={{ color: "#3498db" }}>{this.state.data.email}</Text></Text>
          <Text style={{ color: "#fff" }}>You will be redirected soon.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: "#065471",
    flex: 1
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  }
});
