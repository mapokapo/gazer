import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Keyboard,
  StatusBar,
  TouchableOpacity } from 'react-native'
import firebase from "react-native-firebase";
import ImagePicker from 'react-native-image-picker';
import uuid from "uuid/v4";
import AddItemForm from "../components/AddItemForm";

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class AddItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: 165,
      smallTextButtonMargin: 3,
      itemImageURL: "https://firebasestorage.googleapis.com/v0/b/uim3-8b4ac.appspot.com/o/itemImages%2Fitem_box.png?alt=media&token=7d300e38-55b6-42b6-9e04-f842f16448f3",
      image: null,
      currentUser: null
    }
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#065471"
    },
    headerTintColor: "#fff",
    title: "Add an item"
  };

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
        <View>
          <AddItemForm
            keyboardToggle={this.keyboardToggle}
            smallTextButtonMargin={this.state.smallTextButtonMargin}
            addItem={credentials => {
              this.addItem(credentials);
            }}
          />
        </View>
      </View>
    )
  }

  addItem = credentials => {
    firebase
    .auth()
    .onAuthStateChanged(async user => {
      let currentUser;
      let date = new Date();
      let year = date.getFullYear().toString().substr(-2);
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let formattedDate = year + "-" + month + "-" + day;
      if (user) {
        await firebase.database().ref("users/").child(user.uid).once("value", snapshot => {
          currentUser = snapshot.val();
          this.setState({ currentUser: snapshot.val() });
        });
      }
      if (this.state.image !== null) {
        let ref = firebase.storage().ref("itemImages/").child(uuid());
        let ext = this.state.image.path.split(".")[1];
        ref.putFile(this.state.image.path, { contentType: `image/${ext}` })
        .then(item => {
          firebase.database().ref("items/" + uuid()).set({
            added_by: currentUser.displayName,
            added_on: formattedDate,
            imageURL: item.downloadURL,
            location: credentials.location,
            searchQuery: credentials.title.toLowerCase(),
            title: credentials.title
          }).then(() => {
            this.props.navigation.navigate("Items");
          }).catch(error => {
            alert(error);
          });
        }).catch(error => {
          alert(error)
        });
      } else {
        firebase.database().ref("items/" + uuid()).set({
          added_by: currentUser.displayName,
          added_on: formattedDate,
          imageURL: this.state.itemImageURL,
          location: credentials.location,
          searchQuery: credentials.title.toLowerCase(),
          title: credentials.title
        }).then(() => {
          this.props.navigation.navigate("Items");
        });
      }
    })
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
    flex: 1
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  }
});
