import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { Icon, Button } from "react-native-elements";

export default class ItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam("item"),
      buttonWidth: 0,
      buttonHeight: 0
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("item").title,
      headerStyle: {
        backgroundColor: "#065471"
      },
      headerTintColor: "#fff",
      headerRight: (
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
          <Button icon={
            <Icon type="material" name="edit" color="#3fb0fc" />
          } buttonStyle={{ backgroundColor: "transparent", marginHorizontal: 10 }} />
          <Button icon={
            <Icon type="material" name="delete" color="#e74c3c" />
          } buttonStyle={{ backgroundColor: "transparent", marginRight: 10 }} />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{ display: "flex", alignItems: "center", backgroundColor: "#065471", flex: 1, padding: 5 }}>
        <View>
          <Image source={require("../../media/logo1.png")} style={{ width: 200, height: 200, borderRadius: 200 / 1, backgroundColor: "#fff" }} />
        </View>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" }}>{this.state.item.title}</Text>
          <Text style={{ fontSize: 20, color: "#fff" }}>Added by {this.state.item.added_by}</Text>
        </View>
        <Text style={{ color: "#fff", textAlign: "center" }}>Added on {this.state.item.added_on}</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Icon type="material" name="location-on" color="#E84B3D" /><Text style={{ color: "#fff" }}>{this.state.item.location}</Text></View>
        <View>
          <Image source={require("../../media/qrcode.png")} style={{ width: 125, height: 125, marginTop: 20 }} />
        </View>
        <View style={{ display: "flex", alignSelf: "flex-start", justifyContent: "center", alignItems: "center", flex: 1, width: "100%" }}>
          <Button color="#076c91" icon={
            <Icon
              type="material"
              name="camera"
              color="#fff"
            />
          } buttonStyle={{ borderRadius: (this.state.buttonWidth + this.state.buttonHeight) / 2, minWidth: 125, minHeight: 25 }}
          onLayout={e => {
            this.setState({ buttonWidth: e.nativeEvent.layout.width, buttonHeight: e.nativeEvent.layout.height })
          }} />
        </View>
      </View>
    )
  }
}