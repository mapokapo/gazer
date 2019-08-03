import React, { Component } from 'react';
import { Text, View, Image, Alert } from 'react-native';
import { Icon, Button } from "react-native-elements";
import firebase from 'react-native-firebase';
import QRCode from 'react-native-qrcode';

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
          } buttonStyle={{ backgroundColor: "transparent", marginHorizontal: 10 }}
            onPress={() => {
              this.editItem()
            }}
          />
          <Button icon={
            <Icon type="material" name="delete" color="#e74c3c" />
          } buttonStyle={{ backgroundColor: "transparent", marginRight: 10 }}
            onPress={() => {
              let item = navigation.getParam("item");
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this item?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: () => {
                    firebase.database().ref("items/").child(item.QRCodeURL).remove().then(() => {
                      firebase.storage().ref("itemImages/").child(item.QRCodeURL).delete().then(() => {
                        navigation.navigate("Items");
                      }).catch(() => {
                        navigation.navigate("Items");
                      });
                    }).catch(error => {
                      alert(error);
                    });
                  } },
                ]
              )
            }}
          />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{ display: "flex", alignItems: "center", backgroundColor: "#065471", flex: 1, padding: 5 }}>
        <View>
          <Image source={{ uri: this.state.item.imageURL }} style={{ width: 200, height: 200, borderRadius: 200 / 1, backgroundColor: "#065471" }} />
        </View>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" }}>{this.state.item.title}</Text>
          <Text style={{ fontSize: 20, color: "#fff" }}>Added by {this.state.item.added_by}</Text>
        </View>
        <Text style={{ color: "#fff", textAlign: "center" }}>Added on {this.state.item.added_on}</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Icon type="material" name="location-on" color="#E84B3D" /><Text style={{ color: "#fff" }}>{this.state.item.location}</Text></View>
        <View style={{ width: 115, height: 115, overflow: "hidden", marginTop: 10 }}>
          <QRCode
            value={this.state.item.QRCodeURL}
            size={340}
            bgColor="#fff"
            fgColor="#000"
          />
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