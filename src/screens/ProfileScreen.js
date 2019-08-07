import React, { Component } from "react";
import { View, Text, FlatList, Alert, ToastAndroid, Dimensions, StyleSheet, RefreshControl } from "react-native";
import { ListItem, Overlay, Button, Input, Icon } from "react-native-elements";
import firebase from "react-native-firebase";
import Header from "../components/Header";
import { NavigationEvents } from "react-navigation";
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      userData: "",
      inputName: "",
      modalVisible: false,
      loading: true,
      list: [
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Change Name</Text>,
          mustBeVerified: true,
          action: () => {
            this.setState({ modalVisible: true })
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Change Profile Image</Text>,
          mustBeVerified: true,
          action: () => {
            ImagePicker.showImagePicker(options, (response) => {
              if (!response.didCancel && !response.error) {
                this.refreshState();
                let ref = firebase.storage().ref("profileImages/").child(this.state.user.uid);
                let ext = response.path.split(".")[1];
                ref.putFile(response.path, { contentType: `image/${ext}` })
                .then(item => {
                  firebase.database().ref("users/" + this.state.user.uid).set({
                    displayName: this.state.userData.displayName,
                    imageURL: item.downloadURL
                  }).then(() => {
                    ToastAndroid.show(
                      "Profile Image changed",
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    );
                  });
                }).catch(error => {
                  alert(error)
                });
              }
            });
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Resend Confirmation Email</Text>,
          mustBeVerified: false,
          action: () => {
            firebase.auth().currentUser.sendEmailVerification().then(() => {
              ToastAndroid.show(
                "Confirmation mail sent",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            });
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Sign Out</Text>,
          mustBeVerified: false,
          action: () => {
            firebase.auth().signOut().then(() => {
              this.props.navigation.navigate("Login")
            }).catch(error => {
              alert(error)
            });
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b"  }}>Reset Password</Text>,
          mustBeVerified: false,
          action: () => {
            this.props.navigation.push("ResetPassProfile");
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b" }}>Delete Account</Text>,
          mustBeVerified: false,
          action: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you sure you want to delete your account?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => {
                  let user = firebase.auth().currentUser;
                  if (user)
                    user.delete().then(() => {
                      firebase.storage().ref("profileImages/").child(user.uid).delete().then(() => {
                        firebase.database().ref("users/").child(user.uid).remove().then(() => {
                          this.props.navigation.navigate("Login");
                        });
                      }).catch(() => {
                        firebase.database().ref("users/").child(user.uid).remove().then(() => {
                          this.props.navigation.navigate("Login");
                        });
                      });
                    }).catch(error => {
                      alert(error);
                    });
                }}
              ]
            )
          }
        }
      ]
    }
    this._isMounted = true;
    this.unsubscribe;
  }

  refreshState = () => {
    if (!this._isMounted)
      return;
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user && this._isMounted) {
        firebase.database().ref("users/" + user.uid).once("value", snapshot => {
          if (snapshot.val() && this._isMounted)
            this.setState({ userData: snapshot.val(), user: user, loading: false });
        });
      } else {
        if (this._isMounted) {
          alert("An error occured, try logging in and out");
        }
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted)
      this.refreshState();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe();
  }

  static navigationOptions = {
    header: (<Header currentUser data={async () => {
      let test = new Promise((resolve, reject) => {
        let user = firebase.auth().currentUser;
          if (user) {
            firebase.database().ref("users/" + user.uid).once("value", snapshot => {
              if (snapshot.val())
                resolve(snapshot.val());
              else {
                reject();
              }
            });
          }
      })
      let fd;
      await test.then(data => {
        fd = data;
      });
      return fd;
    }} />)
  }

  changeName = async () => {
    await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user && this._isMounted) {
          firebase.database().ref("users/" + user.uid).once("value", snapshot => {
            if (snapshot.val() && this._isMounted)
              this.setState({ userData: snapshot.val(), user: user, loading: false }, () => {
                resolve(this.state);
              });
          });
        } else {
          if (this._isMounted) {
            alert("An error occured, try logging in and out");
            reject();
          }
        }
      });
    });
    this.setState({ modalVisible: false });
    firebase.database().ref("users/").child(this.state.user.uid).set({
      imageURL: this.state.userData.imageURL,
      displayName: this.state.inputName
    }).then(() => {
      this.setState({ userData: firebase.database().ref("users/").child(this.state.user.uid).once("value", snapshot => {if (snapshot.val()) return snapshot.val()}) })
      ToastAndroid.show(
        "Name Changed",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
    });
  }

  renderItem = ({ item }) => {
    let currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user)
        currentUser = user;
    });
    return (<ListItem
      containerStyle={[ styles.listItem, currentUser.emailVerified || !item.mustBeVerified ? styles.available : styles.unavailable ]}
      title={item.title}
      onPress={() => {
        if (currentUser.emailVerified === true || item.mustBeVerified === false)
          item.action();
        else
          ToastAndroid.show(
            "You must verify your email",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
      }}
    />)
  }

  keyExtractor = (item, index) => index.toString()

  render() {
    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <NavigationEvents
          onDidFocus={() => {
            this.setState({ userData: firebase.database().ref("users/").child(this.state.user.uid).on("value", snapshot => {if (snapshot.val()) return snapshot.val()}), user: firebase.auth().currentUser });
          }}
        />
        <Overlay
          width={Dimensions.get("window").width/100*70}
          height="auto"
          isVisible={this.state.modalVisible}
          windowBackgroundColor="rgba(0, 0, 0, .25)"
          overlayBackgroundColor="#fff"
          overlayStyle={{ padding: 10, paddingVertical: 20 }}
          onBackdropPress={() => this.setState({ modalVisible: false })}
        >
          <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Input
              placeholder="Enter Name"
              errorMessage="Name must be valid!"
              shake={true}
              errorStyle={{ color: "#c0392b" }}
              onChangeText={value => this.setState({ inputName: value })}
            />
            <Button
              buttonStyle={{ marginTop: 10 }}
              title="Done"
              titleStyle={{ marginHorizontal: 5 }}
              icon={
                <Icon
                  name="done"
                  type="material"
                  color="#fff"
                  iconStyle={{ marginHorizontal: 5 }}
                />
              }
              color="#0d0"
              onPress={async () => {
                this.changeName();
              }}
            />
          </View>
        </Overlay>
        <FlatList
          style={{ margin: 3 }}
          data={this.state.list}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.refreshState}
            />
          }
        />
      </View>
    )
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  unavailable: {
    opacity: 0.7
  },
  available: {
    opacity: 1
  },
  listItem: {
    margin: 3,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#fff"
  }
});