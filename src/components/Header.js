import React, { Component, Fragment } from "react";
import { View, Text, Image } from "react-native";
import firebase from "react-native-firebase";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    }
  }

  componentDidMount = async () => {
    if (this.props.currentUser && this.props.data) {
      let data = await this.props.data();
      this.setState({ currentUser: data });
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "#3498db", height: 60, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", position: "relative", paddingVertical: 33.25 }}>
        {(this.state.currentUser !== undefined && this.state.currentUser != null) ?
          (
            <Fragment>
              <Image style={{ height: 48, width: 48, margin: 5, borderRadius: 48 / 2 }} source={{ uri: this.state.currentUser.imageURL }} />
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 5 }}>{this.state.currentUser.displayName}</Text>
            </Fragment>
          )
          : 
          (
            <Fragment>
            <Image style={{ height: 60, width: 60 }} source={require("../../media/logo_circle.png")} />
            <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 5 }}>Gazer</Text>
          </Fragment>
          )
        }
      </View>
    )
  }
}