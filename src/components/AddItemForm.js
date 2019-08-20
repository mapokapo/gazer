import React, { Component } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Picker
} from "react-native";
import { Button } from "react-native-elements";

export default class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      location: "",
      desc: "",
      warn: "",
      category: "All",
      categories: [
        "Automotive & Powersports",
        "Baby Products",
        "Beauty",
        "Books",
        "Camera & Photo",
        "Cell Phones & Accessories",
        "Collectible Coins",
        "Consumer Electronics",
        "Entertainment Collectibles",
        "Fine Art",
        "Grocery & Gourmet Food",
        "Health & Personal Care",
        "Home & Garden",
        "Independent Design",
        "Industrial & Scientific",
        "Major Appliances",
        "Music",
        "Musical Instruments",
        "Office Products",
        "Outdoors",
        "Personal Computers",
        "Pet Supplies",
        "Software",
        "Sports",
        "Sports Collectibles",
        "Tools & Home Improvement",
        "Toys & Games",
        "Video, DVD & Blu-ray",
        "Video Games",
        "Watches",
        "Other",
        "All"
      ]
    };
  }
  
  render() {
    return (
      <View style={{ display: "flex" }}>
        <Picker
          selectedValue={this.state.category}
          style={{
            padding: 5,
            paddingVertical: 30,
            width: "40%",
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            color: "#fff"
          }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({category: itemValue})
          }>
          {this.state.categories.map(cat => {
            return <Picker.Item label={cat} value={cat} key={cat} />
          })}
        </Picker>
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
            borderColor: this.state.warn.includes("desc") ? "#e74c3c" : "#065471"
          }}
          autoCapitalize="sentences"
          placeholder="Item Description"
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={input => {
            this.setState({ desc: input });
          }}
          onFocus={() => {
            let flag = this.state.warn;
            flag = flag.replace("desc", "");
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
