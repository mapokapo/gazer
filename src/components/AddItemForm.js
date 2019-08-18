import React, { Component } from "react";
import {
  TextInput,
  View,
  StyleSheet
} from "react-native";
import { Button } from "react-native-elements";

export default class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      location: "",
      warn: ""
    };
  }
  
  render() {
    return (
      <View style={{ display: "flex" }}>
        <TextInput
          style={{
            ...styles.textInput,
            marginVertical: this.props.smallTextButtonMargin + 3,
            borderColor: this.state.warn.includes("title") ? "#e74c3c" : "#065471"
          }}
          autoCapitalize="words"
          placeholder="Item Name"
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={input => {
            this.setState({ title: input });
          }}
          onFocus={() => {
            let flag = this.state.warn;
            flag = flag.replace("title", "");
            this.setState({ warn: flag });
          }}
        />
        <TextInput
          style={{
            ...styles.textInput,
            marginVertical: this.props.smallTextButtonMargin + 3,
            borderColor: this.state.warn.includes("location") ? "#e74c3c" : "#065471"
          }}
          autoCapitalize="none"
          placeholder="Location (Country, City/State)"
          returnKeyType="done"
          blurOnSubmit={false}
          onChangeText={input => {
            this.setState({ location: input });
          }}
          onFocus={() => {
            let flag = this.state.warn;
            flag = flag.replace("location", "");
            this.setState({ warn: flag });
          }}
        />
        <Button title="ADD ITEM" buttonStyle={styles.bigButton} onPress={() => {
          this.addItem();
        }} />
      </View>
    );
  }

  addItem = () => {
    let flag = "";
    let keys = Object.keys(this.state);
    for (key of keys) {
      if (this.state[key] === "" && key !== "warn") {
        flag += key;
      }
    }
    if (flag === "") {
      this.setState({ warn: "" });
      this.props.addItem(this.state);
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
  bigButton: {
    height: 50,
    backgroundColor: "#3498db"
  }
});
