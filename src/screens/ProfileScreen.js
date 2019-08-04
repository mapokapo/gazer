import React, { Component } from "react";
import { View, Button } from "react-native";
import firebase from "react-native-firebase";
import Header from "../components/Header";

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: (<Header currentUser />)
  }

  render() {
    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <Button title="Sign Out" onPress={() => {
            firebase.auth().signOut().then(() => {
              this.props.navigation.navigate("Auth");
            }).catch(error => {
              alert(error);
            })
          }}
        />
      </View>
    )
  }
}

export default ProfileScreen;
