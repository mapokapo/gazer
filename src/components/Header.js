import React, { Component, Fragment } from "react";
import { View, Text, Image } from "react-native";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    }
  }

  componentDidMount = async () => {
    if (this.props.profile) {
      this.setState({ profile: this.props.profile });
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "#3498db", height: 60, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", position: "relative", paddingVertical: 33.25 }}>
        {(this.state.profile !== null) ?
          (
            <Fragment>
              <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Montserrat-ExtraBold", marginLeft: 15 }}>Profile</Text>
            </Fragment>
          )
          : 
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