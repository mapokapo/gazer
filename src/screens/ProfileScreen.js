import React, { Component } from "react";
import { View, Text, FlatList, Alert, ToastAndroid, Dimensions, StyleSheet, RefreshControl, Image, StatusBar } from "react-native";
import { ListItem, Overlay, Button, Input, Icon } from "react-native-elements";
import firebase from "react-native-firebase";
import Header from "../components/Header";
import ImagePicker from 'react-native-image-picker';
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

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
          mustBeAdmin: false,
          icon: "label",
          iconColor: "#3498db",
          action: () => {
            this.setState({ modalVisible: true })
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Change Profile Image</Text>,
          mustBeVerified: true,
          mustBeAdmin: false,
          icon: "face",
          iconColor: "#3498db",
          action: () => {
            ImagePicker.showImagePicker(options, (response) => {
              if (!response.didCancel && !response.error) {
                this.refreshState().then(state => {
                  let ref = firebase.storage().ref("profileImages/").child(state.user.uid);
                  let ext = response.path.split(".")[1];
                  ref.putFile(response.path, { contentType: `image/${ext}` })
                  .then(item => {
                    let imageDownloadURL = item.downloadURL.split("?");
                    imageDownloadURL[0] += ".webp?";
                    imageDownloadURL = imageDownloadURL.join("");
                    firebase.database().ref("users/" + state.user.uid).set({
                      displayName: state.userData.displayName,
                      imageURL: imageDownloadURL,
                      joined: state.userData.joined,
                      admin: state.userData.admin
                    }).then(() => {
                      ToastAndroid.show(
                        "Profile Image changed",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                      );
                      AsyncStorage.removeItem("profileLoad");
                    });
                  }).catch(error => {
                    alert(error)
                  });
                }).catch(error => alert(error));
              }
            });
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Resend Confirmation Email</Text>,
          mustBeVerified: false,
          mustBeAdmin: false,
          icon: "email",
          iconColor: "#3498db",
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
          mustBeAdmin: false,
          icon: "arrow-back",
          iconColor: "#3498db",
          action: () => {
            firebase.auth().signOut().then(() => {
              this.props.navigation.navigate("Login");
              AsyncStorage.removeItem("profileLoad");
              AsyncStorage.removeItem("adminLoad");
              AsyncStorage.removeItem("itemsList");
            }).catch(error => {
              alert(error)
            });
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b"  }}>Reset Password</Text>,
          mustBeVerified: false,
          mustBeAdmin: false,
          icon: "keyboard",
          iconColor: "#3498db",
          action: () => {
            this.props.navigation.push("ResetPassProfile");
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b" }}>Delete Account</Text>,
          mustBeVerified: false,
          mustBeAdmin: false,
          icon: "delete",
          iconColor: "#3498db",
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
                      firebase.storage().ref("profileImages/").child(user.uid + ".webp").delete().then(() => {
                        firebase.database().ref("users/").child(user.uid).remove().then(() => {
                          firebase.database().ref("items/").once("value", snapshot => {
                            if (snapshot.val()) {
                              let delItems = () => new Promise((resolve, reject) => {
                                for (item of snapshot.val()) {
                                  if (item.added_by_uid === viewedUserData.userID) {
                                    firebase.storage().ref("itemImages/").child(item.itemID + ".webp").delete().then(() => {
                                      firebase.database().ref("items/").child(item.itemID).remove().catch(error => {
                                        alert(error);
                                        reject();
                                      });
                                    }).catch(() => {
                                      firebase.database().ref("items/").child(item.itemID).remove().catch(error => {
                                        alert(error);
                                        reject();
                                      });
                                    });
                                  }
                                }
                                resolve();
                              });
                              delItems().then(() => {
                                this.props.navigation.navigate("Login");
                              });
                            }
                          });
                          this.props.navigation.navigate("Login");
                          AsyncStorage.removeItem("profileLoad");
                          AsyncStorage.removeItem("adminLoad");
                          AsyncStorage.removeItem("itemsList");
                        });
                      }).catch(() => {
                        firebase.database().ref("users/").child(user.uid).remove().then(() => {
                          firebase.database().ref("items/").once("value", snapshot => {
                            if (snapshot.val()) {
                              let delItems = () => new Promise((resolve, reject) => {
                                for (item of snapshot.val()) {
                                  if (item.added_by_uid === viewedUserData.userID) {
                                    firebase.storage().ref("itemImages/").child(item.itemID + ".webp").delete().then(() => {
                                      firebase.database().ref("items/").child(item.itemID).remove().catch(error => {
                                        alert(error);
                                        reject();
                                      });
                                    }).catch(() => {
                                      firebase.database().ref("items/").child(item.itemID).remove().catch(error => {
                                        alert(error);
                                        reject();
                                      });
                                    });
                                  }
                                }
                                resolve();
                              });
                              delItems().then(() => {
                                this.props.navigation.navigate("Login");
                              });
                            }
                          });
                          this.props.navigation.navigate("Login");
                          AsyncStorage.removeItem("profileLoad");
                          AsyncStorage.removeItem("adminLoad");
                          AsyncStorage.removeItem("itemsList");
                        });
                      });
                    }).catch(error => {
                      alert(error);
                    });
                }}
              ]
            )
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#9b59b6" }}>Manage Users</Text>,
          mustBeVerified: true,
          mustBeAdmin: true,
          icon: "settings",
          iconColor: "#3498db",
          action: () => {
            this.refreshState().then(state => {
              this.props.navigation.navigate("AdminControlPanel", { user: state.user, userData: state.userData });
            }).catch(error => alert(error));
          }
        }
      ]
    }
    this._isMounted = false;
  }

  refreshState = () => {
    return new Promise((resolve, reject) => {
      if (!this._isMounted) {
        reject("An error has occured, try signing out and in");
        return;
      }
      let user = firebase.auth().currentUser;
      if (user && this._isMounted) {
        firebase.database().ref("users/" + user.uid).once("value", snapshot => {
          if (snapshot.val() && this._isMounted)
            this.setState({ userData: snapshot.val(), user: user, loading: false }, () => {
              resolve(this.state);
            });
        });
      } else {
        if (this._isMounted) {
          reject("An error has occured, try signing out and in");
        }
      }
    })
  }

  componentDidMount() {
    this._isMounted = true;
  }


  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = {
    header: (<Header profile />)
  }

  changeName = async () => {
    this.refreshState().then(state => {
      this.setState({ modalVisible: false });
      firebase.database().ref("users/").child(state.user.uid).set({
        imageURL: state.userData.imageURL,
        displayName: state.inputName,
        joined: state.userData.joined,
        admin: state.userData.admin
      }).then(() => {
        ToastAndroid.show(
          "Name Changed",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        AsyncStorage.setItem("profileLoad", JSON.stringify({ userData: state.userData, user: state.user }));
      });
    }).catch(error => alert(error));
  }

  renderItem = ({ item }) => {
    let user = firebase.auth().currentUser;
    let userData = this.state.userData;
    return (<ListItem
      containerStyle={[ styles.listItem, (() => {
        if (item.mustBeAdmin) {
          if (userData.admin === 1) {
            if (user.emailVerified) {
              return styles.available;
            } else {
              return styles.unavailable;
            }
          } else {
            return styles.hidden;
          }
        } else if (item.mustBeVerified) {
          if (user.emailVerified) {
            return styles.available;
          } else {
            return styles.unavailable;
          }
        }
      })()
    ]}
      title={<Text style={{ textAlign: "left" }}>{item.title}</Text>}
      leftIcon={{ type: "material", name: item.icon, color: item.iconColor, size: 30 }}
      onPress={() => {
        if (item.mustBeAdmin) {
          if (userData.admin === 1) {
            if (user.emailVerified) {
              item.action();
            } else {
              ToastAndroid.show(
                "You must verify your email",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }
          }
        } else if (item.mustBeVerified) {
          if (user.emailVerified) {
            item.action();
          } else {
            ToastAndroid.show(
              "You must verify your email",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          }
        } else {
          item.action();
        }
      }}
    />)
  }

  keyExtractor = (item, index) => index.toString()

  render() {
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <NavigationEvents
          onDidFocus={() => {
            AsyncStorage.getItem("profileLoad").then(item => {
              if (this._isMounted) {
                if (!item) {
                  this.setState({ loading: true }, () => {
                    this.refreshState().then(state => {
                      AsyncStorage.setItem("profileLoad", JSON.stringify({ userData: state.userData, user: state.user }));
                    });
                  });
                } else {
                  AsyncStorage.getItem("profileLoad").then(item1 => {
                    this.setState({ userData: JSON.parse(item1).userData, user: JSON.parse(item1).user, loading: false });
                  })
                }
            }
            });
          }}
        />
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
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
              errorStyle={{ color: "#333" }}
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
        <View style={{ display: "flex", backgroundColor: "#eee", padding: 13, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderBottomColor: "#111", borderBottomWidth: StyleSheet.hairlineWidth }}>
          <Image style={{ height: 95, width: 95, borderRadius: 95 / 2 }} source={{ uri: this.state.userData.imageURL }} />
          <View style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Text style={{ fontSize: 20, fontWeight: "bold" }}>{this.state.userData.displayName}</Text>{this.state.user.emailVerified && <Icon containerStyle={{ marginLeft: 4 }} type="material" name="verified-user" color="#27ae60" size={20} />}{this.state.userData.admin === 1 && <Icon type="material" name="grade" color="#9b59b6" size={22} />}</View>
            <Text>{this.state.user.email}</Text>
          </View>
        </View>
        <FlatList
          style={{ margin: 3 }}
          data={this.state.list}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {
                this.refreshState().then(state => {
                  AsyncStorage.removeItem("profileLoad").then(() => {
                    AsyncStorage.setItem("profileLoad", JSON.stringify({ userData: state.userData, user: state.user }));
                  });
                });
              }}
            />
          }
        />
        <Text style={{ textAlign: "center", color: "#444" }}>Made by Leo Petrović</Text>
      </View>
    )
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  unavailable: {
    opacity: 0.5
  },
  available: {
    opacity: 1
  },
  hidden: {
    display: "none"
  },
  listItem: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#111",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});