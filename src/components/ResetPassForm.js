import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from "react-native-elements";

export default class ResetPassForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      warn: ""
    }
  }

  componentDidUpdate() {
    if (this.props.sent) {
      this.props.disableKeyboard();
    }
  }

  render() {
    return (
      <View style={{ display: "flex" }}>
        {!(this.props.sent) ?
          (<View style={{ margin: 15 }}><Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>In order to reset your password, we need your email adress first.</Text></View>)
          :
          (<View style={{ margin: 15 }}><Text style={{ color: "#2ecc71", fontSize: 20, textAlign: "center" }}>Password reset email has been sent to <Text style={{ color: "#3498db" }}>{this.state.email}</Text></Text></View>)}
        {!(this.props.sent) && <TextInput
          style={{
            ...styles.textInput,
            marginVertical: this.props.smallTextButtonMargin + 5,
            borderColor: this.state.warn.includes("email") ? "#e74c3c" : "#065471"
          }}
          placeholder="Email"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => this.resetPass()}
          onChangeText={input => {
            this.setState({ email: input });
          }}
          onFocus={() => {
            let flag = this.state.warn;
            flag = flag.replace("email", "");
            this.setState({ warn: flag });
          }}
        />
        }
        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginVertical: 5,
            marginBottom: this.props.smallTextButtonMargin + 5
          }}
        >
        </View>
        <Button title="RESET PASSWORD" buttonStyle={styles.bigButton} onPress={() => {
          this.resetPass();
        }} />
      </View>
    )
  }

  resetPass = () => {
    let flag = "";
    let keys = Object.keys(this.state);
    for (key of keys) {
      if (this.state[key] === "" && key !== "warn") {
        flag += key;
      }
    }
    if (flag === "") {
      this.setState({ warn: "" });
      this.props.resetPass(this.state.email);
    } else {
      this.setState({ warn: flag });
    }
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    borderStyle: "solid",
    position: "relative",
    backgroundColor: "#fff"
  },
  smallTextButton: {
    color: "#3fb0fc"
  },
  bigButton: {
    height: 50,
    backgroundColor: "#3498db"
  }
});