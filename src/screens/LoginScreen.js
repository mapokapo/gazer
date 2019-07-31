import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Keyboard,
  StatusBar
} from "react-native";
import LoginForm from "../components/LoginForm";
import firebase from "react-native-firebase";

export default class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: 200,
      smallTextButtonMargin: 3
    };
  }
  static navigationOptions = {
    header: null
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
        <View style={styles.loginContainer}>
          <LoginForm
            login={state => {
              this.handleLogin(state);
            }}
            resetPass={() => {
              this.props.navigation.navigate("ResetPass");
            }}
            noAccount={() => {
              this.props.navigation.navigate("Register");
            }}
            keyboardToggle={flag => {
              this.keyboardToggle(flag);
            }}
            smallTextButtonMargin={this.state.smallTextButtonMargin}
          />
        </View>
      </View>
    );
  }

  handleLogin = credentials => {
    firebase
    .auth()
    .signInWithEmailAndPassword(credentials.email, credentials.pass)
    .then(() => {
      this.props.navigation.navigate("App");
    }).catch(error => {
      alert(error);
    });
  };

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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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
