import React, { Component, Fragment } from "react";
import { View, Text, Image } from "react-native";
import firebase from "react-native-firebase";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myWidth: 0,
      currentUser: undefined,
      imageURL: undefined
    }
  }

  componentWillMount = async () => {
    if (this.props.currentUser) {
      firebase.auth().onAuthStateChanged(user => {
        if (user)
          firebase.database().ref("users/" + user.uid).once("value").then(snapshot => {
            this.setState({ currentUser: snapshot.val() });
          });
      })
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "#3498db", height: 60, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", position: "relative" }}>
        {(this.state.currentUser === undefined) ?
          (
            <Fragment>
              <Image style={{ height: 60, width: 60 }} source={require("../../media/logo_circle.png")} />
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 5 }}>Gazer</Text>
            </Fragment>
          )
          : 
          (
            <Fragment>
              <Image style={{ height: 60, width: 60 }} source={{ uri: this.state.imageURL }} />
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 5 }}>{this.state.currentUser.displayName}</Text>
            </Fragment>
          )
        }
      </View>
    )
  }
}