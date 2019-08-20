import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Keyboard, StyleSheet, TextInput, Picker } from 'react-native'
import { Button } from 'react-native-elements';
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class ItemEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam("item"),
      title: this.props.navigation.getParam("item").title,
      location: this.props.navigation.getParam("item").location,
      desc: this.props.navigation.getParam("item").desc,
      itemImageURL: this.props.navigation.getParam("item").imageURL,
      image: null,
      logoSize: 165,
      smallTextButtonMargin: 3,
      warn: "",
      category: "Other",
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
        "Other"
      ]
    }
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#065471"
    },
    headerTintColor: "#fff",
    title: "Edit Item"
  }

  addItem = credentials => {
    let user = firebase.auth().currentUser;
    let userData;
    let date = new Date();
    let year = date.getFullYear().toString().substr(-2);
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let formattedDate = year + "-" + month + "-" + day;
    firebase.database().ref("users/").child(user.uid).once("value", snapshot => {
      if (!snapshot.val())
        return;
      userData = snapshot.val();
    }).then(() => {
      let itemID = credentials.item.itemID;
      let QRCodeID = credentials.item.QRCodeID;
      if (this.state.image !== null) {
        let ref = firebase.storage().ref("itemImages/").child(itemID);
        let ext = this.state.image.path.split(".")[1];
        ref.putFile(this.state.image.path, { contentType: `image/${ext}` })
        .then(item => {
          let imageDownloadURL = item.downloadURL.split("?");
          imageDownloadURL[0] += ".webp?";
          imageDownloadURL = imageDownloadURL.join("");
          firebase.database().ref("items/" + itemID).set({
            added_by: userData.displayName,
            added_by_uid: user.uid,
            added_on: formattedDate,
            imageURL: imageDownloadURL,
            QRCodeURL: QRCodeID,
            location: credentials.location,
            searchQuery: credentials.title.toLowerCase(),
            title: credentials.title,
            itemID: itemID,
            category: credentials.category,
            desc: credentials.desc
          }).then(() => {
            this.props.navigation.navigate("Items");
          }).catch(error => {
            alert(error);
          });
        }).catch(error => {
          alert(error)
        });
      } else {
        firebase.database().ref("items/" +itemID).set({
          added_by: userData.displayName,
          added_by_uid: user.uid,
          added_on: formattedDate,
          imageURL: this.state.itemImageURL,
          QRCodeURL: QRCodeID,
          location: credentials.location,
          searchQuery: credentials.title.toLowerCase(),
          title: credentials.title,
          itemID: itemID,
          category: credentials.category,
          desc: credentials.desc
        }).then(() => {
          this.props.navigation.navigate("Items");
        });
      }
    });
  }

  updateItem = () => {
    let flag = "";
    let keys = Object.keys(this.state);
    for (key of keys) {
      if ((key === "title" && this.state[key] === "") || (key === "location" && this.state[key] === "") || (key === "desc" && this.state[key] === "")) {
        flag += key;
      }
    }
    if (flag === "") {
      this.setState({ warn: "" });
      this.addItem(this.state);
    } else {
      this.setState({ warn: flag });
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => {
          ImagePicker.showImagePicker(options, (response) => {
            if (!response.didCancel && !response.error) {
              this.setState({ image: response, itemImageURL: response.uri });
            }
          });
        }}>
          <Image
            style={this.logoStyle()}
            source={{ uri: this.state.itemImageURL }}
          />
        </TouchableOpacity>
        </View>
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
              return <Picker.Item label={cat} value={cat} key={cat}  />
            })}
          </Picker>
          <TextInput
            style={{
              ...styles.textInput,
              marginVertical: this.state.smallTextButtonMargin + 3,
              borderColor: this.state.warn.includes("title") ? "#e74c3c" : "#065471"
            }}
            autoCapitalize="none"
            placeholder="Item Name"
            returnKeyType="next"
            blurOnSubmit={false}
            value={this.state.title}
            onSubmitEditing={() => this.descInput.focus()}
            onChangeText={text => this.setState({ title: text })}
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
            value={this.state.desc}
            ref={input => (this.descInput = input)}
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
              marginVertical: this.state.smallTextButtonMargin + 3,
              borderColor: this.state.warn.includes("location") ? "#e74c3c" : "#065471"
            }}
            autoCapitalize="none"
            placeholder="Location (Country, City/State)"
            returnKeyType="done"
            blurOnSubmit={false}
            value={this.state.location}
            ref={input => (this.locationInput = input)}
            onSubmitEditing={this.updateItem}
            onChangeText={text => this.setState({ location: text })}
            onFocus={() => {
              let flag = this.state.warn;
              flag = flag.replace("location", "");
              this.setState({ warn: flag });
            }}
          />
          <Button title="UPDATE ITEM" buttonStyle={styles.bigButton} onPress={() => {
            this.updateItem();
          }} />
        </View>
      </View>
    )
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
      height: this.state.logoSize,
      borderRadius: this.state.logoSize / 2
    };
  }

  keyboardToggle(flag) {
    if (flag) {
      this.setState({ logoSize: 100, smallTextButtonMargin: 0 });
    } else {
      this.setState({ logoSize: 165, smallTextButtonMargin: 3 });
    }
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: "#065471",
    flex: 1,
    padding: 5
  },
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
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  }
});
