import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Header from "../components/Header";
import { RNCamera } from "react-native-camera";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0
    };
  }

  static navigationOptions = {
    header: (<Header />)
  };

  componentDidMount() {
    this.setState({ screenWidth: Dimensions.get("window").width });
  }

  handleQRScan = data => {
    //alert(data.data);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: this.state.screenWidth, height: this.state.screenWidth, overflow: "hidden", margin: 5 }}>
          <RNCamera
            style={styles.camera}
            captureAudio={false}
            ref={ref => {
              this.camera = ref;
            }}
            type={RNCamera.Constants.Type.back}
            onGoogleVisionBarcodesDetected={data => {
              this.handleQRScan(data);
            }}
            googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
            ratio="1:1"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#065471"
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});