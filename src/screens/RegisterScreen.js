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
      profileImageURL: "https://firebasestorage.googleapis.com/v0/b/uim3-8b4ac.appspot.com/o/profileImages%2Favatar.png?alt=media&token=2eb1bf6b-bedf-4223-8124-ea340a6a6fc5",
      image: null
    };
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#065471"
    },
    headerTintColor: "#fff",
    title: "Register"
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
        <View>
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
    .then(async user => {
      user.user.updateProfile({
        displayName: credentials.name
      });
      let date = new Date();
      let year = date.getFullYear().toString().substr(-2);
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let formattedDate = year + "-" + month + "-" + day;
      if (this.state.image !== null) {
        let ref = firebase.storage().ref("profileImages/").child(user.user.uid);
        let ext = this.state.image.path.split(".")[1];
        ref.putFile(this.state.image.path, { contentType: `image/${ext}` })
        .then(item => {
          let imageDownloadURL = item.downloadURL.split("?");
          imageDownloadURL[0] += ".webp?";
          imageDownloadURL = imageDownloadURL.join("");
          firebase.database().ref("users/" + user.user.uid).set({
            displayName: credentials.name,
            imageURL: imageDownloadURL,
            admin: 0,
            joined: formattedDate,
            userID: user.user.uid
          }).then(() => {
            this.props.navigation.navigate("EmailVerification", { data: { imageURL: imageDownloadURL, email: user.user.email } });
          });
        }).catch(error => {
          alert(error)
        });
      } else {
        firebase.database().ref("users/" + user.user.uid).set({
          displayName: credentials.name,
          imageURL: this.state.profileImageURL,
          admin: 0,
          joined: formattedDate,
          userID: user.user.uid
        }).then(() => {
          this.props.navigation.navigate("EmailVerification", { data: { imageURL: this.state.profileImageURL, email: user.user.email } });
        });
      }
    }).catch(error => {
      alert(error);
    });
  };

  uploadImage = async (uri, name) => {
    let ref = firebase.storage().ref("profileImages/").child(name);
    let ext = uri.split(".")[1];
    return ref.putFile(uri, { contentType: `image/${ext}`, name });
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
      this.setState({ logoSize: 80, smallTextButtonMargin: 0 });
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
