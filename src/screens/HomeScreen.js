import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: (<Header />)
  };

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#065471',
  }
});