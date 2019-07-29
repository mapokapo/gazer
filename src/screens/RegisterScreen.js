import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Keyboard,
  StatusBar
} from "react-native";
import RegisterForm from "../components/RegisterForm";
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
          <RegisterForm
            register={state => {
              this.handleRegister(state);
            }}
            hasAccount={() => {
              this.props.navigation.navigate("Login");
            }}
            keyboardToggle={this.keyboardToggle}
            smallTextButtonMargin={this.state.smallTextButtonMargin}
          />
        </View>
      </View>
    );
  }

  handleRegister = credentials => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(credentials.email, credentials.pass)
    .then(user => {
      firebase.database().ref("users/" + user.user.uid).set({
        displayName: credentials.displayName,
        email: credentials.email,
        password: credentials.pass
      });
      this.props.navigation.navigate("App");
      return user.updateProfile({
        displayName: credentials.name
      });
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
