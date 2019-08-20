import React, { Component } from 'react';
import { Text, View, Image, Alert, StatusBar } from 'react-native';
import { Icon, Button } from "react-native-elements";
import firebase from 'react-native-firebase';
import QRCode from 'react-native-qrcode';

export default class ItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam("item"),
      userData: this.props.navigation.getParam("userData"),
      buttonWidth: 0,
      buttonHeight: 0
    }
    this._isMounted = false;
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
          {navigation.getParam("userData").admin === 1 &&
            <Button icon={
              <Icon type="material" name="edit" color="#3fb0fc" />
            } buttonStyle={{ backgroundColor: "transparent", marginHorizontal: 10 }}
              onPress={() => {
                navigation.navigate("EditItem", { item: navigation.getParam("item") })
              }}
            />
          }
          {navigation.getParam("userData").admin === 1 &&
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
                      firebase.database().ref("items/").child(item.itemID).remove().then(() => {
                        firebase.storage().ref("itemImages/").child(item.itemID).delete().then(() => {
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
          }
        </View>
      )
    }
  }

  componentDidMount() {
    this._isMounted = true;
    firebase.auth().onAuthStateChanged(user => {
      if (user)
        firebase.database().ref("users/").child(user.uid).on("value", snapshot => {
          if (snapshot.val() && this._isMounted)
            this.setState({ userData: snapshot.val(), user });
        })
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ display: "flex", alignItems: "center", backgroundColor: "#065471", flex: 1, padding: 5 }}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <View>
          <Image source={{ uri: this.state.item.imageURL }} style={{ width: 200, height: 200, borderRadius: 200 / 1, backgroundColor: "#065471" }} />
        </View>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" }}>{this.state.item.title}</Text>
          <Text style={{ fontSize: 20, color: "#fff" }}>Added by {this.state.item.added_by}</Text>
        </View>
        <Text style={{ color: "#fff", textAlign: "center" }}>Added on {this.state.item.added_on}</Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Icon type="material" name="location-on" color="#E84B3D" /><Text style={{ color: "#fff" }}>{this.state.item.location}</Text></View>
        <Text style={{ color: "#fff" }}>Category: {this.state.item.category}</Text>
        <View style={{ width: 120, height: 120, overflow: "hidden", marginTop: 15 }}>
          <QRCode
            value={this.state.item.QRCodeURL}
            size={343}
            bgColor="#fff"
            fgColor="#000"
          />
        </View>
        <Text style={{ textAlign: "center", color: "#fff", fontFamily: "Montserrat-ExtraBold" }}>Description: {this.state.item.desc}</Text>
      </View>
    )
  }
}