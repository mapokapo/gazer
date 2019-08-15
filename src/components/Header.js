import React, { Component, Fragment } from "react";
import { View, Text, Image } from "react-native";
import firebase from "react-native-firebase";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      userPanel: null,
      viewedUserData: null
    }
  }

  componentDidMount = async () => {
    if (this.props.profile) {
      this.setState({ profile: this.props.profile });
    }
    if (this.props.userPanel && this.props.userData) {
      this.setState({ userPanel: this.props.userPanel, viewedUserData: this.props.userData });
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "#3498db", height: 60, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", position: "relative", paddingVertical: 33.25 }}>
        {this.state.userPanel !== null && this.state.profile === null &&
          (
            <Fragment>
              <Image style={{ height: 46, width: 46, marginLeft: 6, borderRadius: 46 / 2 }} source={{ uri: this.state.viewedUserData.imageURL }} />
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 10 }}>{this.state.viewedUserData.displayName}</Text>
            </Fragment>
          )
        }
        {this.state.profile !== null && this.state.userPanel === null &&
          (
            <Fragment>
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 15 }}>Profile</Text>
            </Fragment>
          )
        }
        {this.state.userPanel === null && this.state.profile === null &&
          (
            <Fragment>
              <Image style={{ height: 60, width: 60, marginLeft: 3 }} source={require("../../media/logo_circle.png")} />
              <Text style={{ color: "#fff", fontSize: 24, marginLeft: 3, fontFamily: "Montserrat-ExtraBold" }}>Gazer</Text>
            </Fragment>
          )
        }
      </View>
    )
  }
}