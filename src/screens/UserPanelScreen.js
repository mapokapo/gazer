import React, { Component } from "react";
import { Text, View, StatusBar, TouchableOpacity, Keyboard, TextInput, StyleSheet, Image } from "react-native";
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";
import Header from "../components/Header";
import { Icon, Button } from "react-native-elements";

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class UserPanelScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: 165,
      viewedUserData: this.props.navigation.getParam("userData"),
      user: "",
      userData: "",
      getUser: firebase.functions().httpsCallable("getUser"),
      profileImageURL: this.props.navigation.getParam("userData").imageURL,
      image: null,
      displayName: this.props.navigation.getParam("userData").displayName,
      warn: "",
      smallTextButtonMargin: 3
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: <Header userPanel userData={navigation.getParam("userData")} back={() => navigation.goBack()} />,
      headerStyle: {
        backgroundColor: "#065471"
      },
      headerTintColor: "#fff"
    }
  };

  updateUser = credentials => {
    let userID = credentials.viewedUserData.userID;
    if (this.state.image !== null) {
      let ref = firebase.storage().ref("profileImages/").child(userID);
      let ext = this.state.image.path.split(".")[1];
      ref.putFile(this.state.image.path, { contentType: `image/${ext}` })
      .then(item => {
        firebase.database().ref("users/" + userID).set({
          displayName: credentials.displayName,
          imageURL: item.downloadURL,
          admin: credentials.viewedUserData.admin,
          joined: credentials.viewedUserData.joined,
          userID: credentials.viewedUserData.userID
        }).then(() => {
          this.props.navigation.navigate("AdminControlPanel");
        }).catch(error => {
          alert(error);
        });
      }).catch(error => {
        alert(error)
      });
    } else {
      firebase.database().ref("users/" + userID).set({
        displayName: credentials.displayName,
        imageURL: credentials.viewedUserData.imageURL,
        admin: credentials.viewedUserData.admin,
        joined: credentials.viewedUserData.joined,
        userID: credentials.viewedUserData.userID
      }).then(() => {
        this.props.navigation.navigate("AdminControlPanel");
      });
    }
  }

  checkInput = () => {
    let flag = "";
    let keys = Object.keys(this.state);
    for (key of keys) {
      if (key === "displayName" && this.state[key] === "") {
        flag += key;
      }
    }
    if (flag === "") {
      this.setState({ warn: "" });
      this.updateUser(this.state);
    } else {
      this.setState({ warn: flag });
    }
  }

  render() {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <View style={styles.logoContainer}>
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
          <Text style={{ color: "#fff", fontSize: 20, fontFamily: "Montserrat-ExtraBold" }}>{this.state.displayName}</Text>
        </View>
        <View>
          <View style={{ marginBottom: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-ExtraBold" }}>Joined {this.state.viewedUserData.joined}</Text>
            {this.state.viewedUserData.emailVerified &&
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" name="verified-user" size={24} color="#27ae60" /><Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-ExtraBold" }}>Email Verified</Text></View>
            }
            {this.state.viewedUserData.admin === 1 &&
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" name="grade" size={24} color="#9b59b6" /><Text style={{ color: "#fff", fontSize: 16, fontFamily: "Montserrat-ExtraBold" }}>User is Admin</Text></View>
            }
          </View>
          <TextInput
            style={{
              ...styles.textInput,
              marginVertical: this.state.smallTextButtonMargin + 3,
              borderColor: "#065471"
            }}
            value={this.state.viewedUserData.email}
            editable={false}
            placeholder="Email"
            blurOnSubmit={false}
          />
          <TextInput
            style={{
              ...styles.textInput,
              marginVertical: this.state.smallTextButtonMargin + 3,
              borderColor: this.state.warn.includes("displayName") ? "#e74c3c" : "#065471"
            }}
            autoCapitalize="words"
            placeholder="Name"
            returnKeyType="next"
            blurOnSubmit={false}
            value={this.state.viewedUserData.displayName}
            editable={this.state.viewedUserData.admin !== 1}
            onChangeText={text => this.setState({ displayName: text })}
            onSubmitEditing={() => this.checkInput()}
            onFocus={() => {
              let flag = this.state.warn;
              flag = flag.replace("displayName", "");
              this.setState({ warn: flag });
            }}
          />
          <Button title="UPDATE USER" buttonStyle={styles.bigButton} onPress={() => {
            this.checkInput();
          }} />
        </View>
      </View>
    );
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