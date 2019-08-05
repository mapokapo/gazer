import React, { Component } from "react";
import { View, Text, FlatList, Alert, ToastAndroid, Dimensions, StyleSheet } from "react-native";
import { ListItem, Overlay, Button, Input, Icon } from "react-native-elements";
import firebase from "react-native-firebase";
import Header from "../components/Header";
import { NavigationEvents } from "react-navigation";

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      userData: "",
      inputName: "",
      modalVisible: false,
      list: [
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b"  }}>Reset Password</Text>,
          mustBeVerified: false,
          action: () => {
            this.props.navigation.navigate("ResetPassProfile");
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
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Change Name</Text>,
          mustBeVerified: true,
          action: () => {
            this.setState({ modalVisible: true })
          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20 }}>Change Location</Text>,
          mustBeVerified: true,
          action: () => {

          }
        },
        {
          title: <Text style={{ textAlign: "center", fontSize: 20, color: "#c0392b" }}>Sign Out</Text>,
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
                  firebase.database().ref("users/").child(user.uid).remove().then(() => {
                    user.delete().then(() => {
                      this.props.navigation.navigate("Auth");
                    }).catch(error => {
                      alert(error);
                    });
                  });
                }}
              ]
            )
          }
        }
      ]
    }
  }

  static navigationOptions = {
    header: (<Header currentUser />)
  }

  renderItem = ({ item }) => {
    firebase.auth().currentUser.reload();
    return (<ListItem
      containerStyle={[ styles.listItem, firebase.auth().currentUser.emailVerified || !item.mustBeVerified ? styles.available : styles.unavailable ]}
      title={item.title}
      onPress={() => {
        if (firebase.auth().currentUser.emailVerified || !item.mustBeVerified)
          item.action();
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
              onPress={() => {
                this.setState({ modalVisible: false });
                firebase.database().ref("users/").child(this.state.user.uid).set({
                  ...this.state.userData,
                  displayName: this.state.inputName
                }).then(() => {
                  this.setState({ userData: firebase.database().ref("users/").child(this.state.user.uid).on("value", snapshot => {if (snapshot.val()) return snapshot.val()}) })
                  ToastAndroid.show(
                    "Name Changed",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  )
                });
              }}
            />
          </View>
        </Overlay>
        <FlatList
          style={{ margin: 3 }}
          data={this.state.list}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
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