import React, { Component } from "react";
import { View, Text, RefreshControl, FlatList, StatusBar } from "react-native";
import { Icon, SearchBar, ListItem } from "react-native-elements";
import firebase from "react-native-firebase";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

export default class AdminControlPanelScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      userList: [],
      loading: true,
      userData: "",
      user: "",
      getUser: firebase.functions().httpsCallable("getUser")
    }
    this._isMounted = false;
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = () => {
    this._isMounted = true;
    let user = firebase.auth().currentUser;
    firebase.database().ref("users/").child(user.uid).once("value", snapshot => {
      if (snapshot.val() && this._isMounted) {
        this.setState({ user, userData: snapshot.val() });
      }
    });
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  fetchUsers = callback => {
    if (this._isMounted)
      firebase.database().ref("users/").once("value", async snapshot => {
        if (!snapshot.val() || snapshot.numChildren() === 1 || !this._isMounted) {
          this.setState({ userList: [], loading: false })
          return;
        }
        let userArray = [];
        let userObj = snapshot.val();
        for (let key of Object.keys(userObj)) {
          await new Promise((resolve, reject) => {
            this.state.getUser({ uid: key }).then(userRecord => {
              if (this._isMounted)
                resolve(userRecord.data);
              else reject();
            }).catch(error => {
              alert(error);
              reject();
            });
          }).then(async data => {
            await firebase.database().ref("users/").child(key).once("value", ss => {
              if (ss.val() && this._isMounted) {
                userObj[key].admin = ss.val().admin;
                userObj[key].emailVerified = data.emailVerified;
                userObj[key].email = data.email;
                if (ss.val().userID === this.state.userData.userID) {
                  userObj[key].visible = false;
                } else {
                  userObj[key].visible = true;
                }
              }
            });
          });
        }
        userArray = Object.values(userObj);
        this.setState({ userList: userArray, loading: false }, () => callback(userArray) );
      });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => {
    return (item.visible === true && <ListItem
      onPress={() => {
        this.props.navigation.navigate("UserPanel", { userData: item });
      }}
      containerStyle={{ margin: 3, borderRadius: 5, padding: 10 }}
      title={item.displayName}
      titleStyle={{ fontSize: 18 }}
      subtitle={
        <View>
          <Text style={{ color: "#444" }}>Joined on {item.joined}</Text>
        </View>
      }
      rightSubtitle={
        <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
          {item.admin === 1 && <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" size={20} color="#9b59b6" name="grade" /><Text numberOfLines={1} style={{ color: "#333" }}>Admin</Text></View>}
          {item.emailVerified && <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}><Icon type="material" size={18} color="#27ae60" name="verified-user" /><Text numberOfLines={1} style={{ color: "#333" }}>Verified</Text></View>}
        </View>
      }
      rightContentContainerStyle={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
      leftAvatar={{ source: { uri: item.imageURL }, size: "medium" }}
    />)
  }

  updateSearch = search => {
    this.setState({ search }, () => {
      firebase.database().ref("users/").orderByChild("displayName").startAt(search.toUpperCase()).endAt(search.toLowerCase()+"\uf8ff").once("value", snapshot => {
        if (snapshot.val()) {
          this.setState({ list: Object.values(snapshot.val()) });
        }
      });
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: "#065471", flex: 1 }}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <NavigationEvents
          onDidFocus={() => {
            if (this._isMounted) {
              AsyncStorage.getItem("adminLoad").then(item => {
                if (!item)
                  this.setState({ loading: true }, () => {
                    this.fetchUsers(users => {
                      alert(users);
                      users.length !== 0 ? AsyncStorage.setItem("adminLoad", JSON.stringify(users)) : AsyncStorage.removeItem("adminLoad");
                    });
                  });
                else {
                  AsyncStorage.getItem("adminLoad").then(item1 => {
                    this.setState({ userList: JSON.parse(item1).users, loading: false });
                  })
                }
              });
              this.setState({ user: this.props.navigation.getParam("user") , userData: this.props.navigation.getParam("userData") });
            }
          }}
        />
        <SearchBar
          lightTheme round
          placeholder="Search Users..."
          onChangeText={this.updateSearch}
          value={this.state.search}
          inputContainerStyle={{ backgroundColor: "#2980b9" }}
          inputStyle={{ color: "#fff" }}
          placeholderTextColor="#fff"
          searchIcon={<Icon type="material" name="search" color="#fff" />}
          containerStyle={{ backgroundColor: "#3498db", borderBottomColor: "transparent", borderTopColor: "transparent" }}
        />
        <FlatList
          style={{ margin: 3 }}
          ListEmptyComponent=
            {!this.state.loading &&
              <View style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                <Text style={{ textAlign: "center", color: "#fff", fontFamily: "Montserrat-ExtraBold" }}>There aren't any users registered.</Text>
              </View>
            }
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {
                this.fetchUsers(users => {
                  AsyncStorage.removeItem("adminLoad").then(() => {
                    if (users.length !== 0)
                      AsyncStorage.setItem("adminLoad", JSON.stringify(users));
                  });
                });
              }}
            />
          }
          data={this.state.userList}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}
