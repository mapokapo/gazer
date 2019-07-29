import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Keyboard,
  StatusBar,
  TouchableOpacity
} from "react-native";
import RegisterForm from "../components/RegisterForm";
import firebase from "react-native-firebase";
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid/v4';
import RNFetchBlob from "react-native-fetch-blob";


const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: 165,
      smallTextButtonMargin: 3,
      profileImageURL: "https://firebasestorage.googleapis.com/v0/b/uim3-8b4ac.appspot.com/o/avatar.png?alt=media&token=9916da50-2f36-4d89-983b-5f530bcd4ac1",
      image: null
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
          <TouchableOpacity onPress={() => {
            ImagePicker.showImagePicker(options, (response) => {
              if (!response.didCancel && !response.error) {
                this.setState({ image: response, profileImageURL: response.uri });
              }
            });
          }}>
            <Image
              style={this.logoStyle()}
              source={{ uri: this.state.profileImageURL }}
            />
          </TouchableOpacity>
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
      const ext = this.state.profileImageURL.split('.').pop();
      const filename = `${uuid()}.${ext}`;

      const image = this.state.profileImageURL.uri;
 
      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      let uploadBlob = null,
        mime = `image/${ext}`;

      const imageRef = firebase.storage().ref("profileImages").child(filename);

      fs.readFile(image, "base64")
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          firebase.database().ref("users/" + user.user.uid).set({
            displayName: credentials.name,
            imageURL: url
          }).then(() => {
            this.props.navigation.navigate("Auth");
          });
        })
        .catch((error) => {
          console.log(error);
        }) 
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
