import React, { Component } from "react";
import { View } from "react-native";
import Header from "../components/Header";

export default class HomeScreen extends Component {
    static navigationOptions = {
      header: (<Header />)
    };
  
    render() {
      return (
        <View style={{ backgroundColor: "#065471", flex: 1 }}>
          
        </View>
      );
    }
  }