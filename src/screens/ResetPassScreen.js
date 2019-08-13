import React, { Component } from 'react'
import { View, StyleSheet, Image, Keyboard, StatusBar } from 'react-native'
import firebase from "react-native-firebase";
import ResetPassForm from "../components/ResetPassForm";

export default class ResetPassScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sent: false,
      logoSize: 200,
      smallTextButtonMargin: 3
    }
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#065471"
    },
    headerTintColor: "#fff"
  };

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
            style={this.logoStyle()}
            source={require("../../media/logo.png")}
          />
        </View>
        <ResetPassForm
         sent={this.state.sent}
         smallTextButtonMargin={this.state.smallTextButtonMargin}
         resetPass={email => {
          this.resetPass(email);
         }}
         disableKeyboard={this.disableKeyboard}
         />
      </View>
    )
  }

  resetPass = email => {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      this.setState({ sent: true });
    }).catch(error => {
      alert(error);
    });
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardOpened.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardClosed.bind(this)
    );
  }

  disableKeyboard = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillUnmount() {
    this.disableKeyboard();
  }

  _keyboardOpened() {
    this.keyboardToggle(true);
  }

  _keyboardClosed() {
    this.keyboardToggle(false);
  }

  logoStyle() {
    return {
      width: this.state.logoSize,
      height: this.state.logoSize
    };
  }

  keyboardToggle(flag) {
    if (flag) {
      this.setState({ logoSize: 135, smallTextButtonMargin: 0 });
    } else {
      this.setState({ logoSize: 200, smallTextButtonMargin: 3 });
    }
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