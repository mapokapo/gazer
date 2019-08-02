import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Animated, Text } from "react-native";
import Header from "../components/Header";
import { RNCamera } from "react-native-camera";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      cameraBoxOpacity: new Animated.Value(1),
      renderBox: false
    };
  }

  static navigationOptions = {
    header: (<Header />)
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ renderBox: true });
    }, 1000);
    this.setState({ screenWidth: Dimensions.get("window").width });
    Animated.loop(
      Animated.sequence(
        [
          Animated.timing(
            this.state.cameraBoxOpacity,
            {
              toValue: 0.75,
              duration: 750
            }
          ),
          Animated.timing(
            this.state.cameraBoxOpacity,
            {
              toValue: 1,
              duration: 750
            }
          )
        ]
      ),
      {
        iterations: 5
      }
    ).start();
  }

  handleQRScan = data => {
    alert(data.data);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: 375, height: 475, borderRadius: 15, overflow: "hidden" }}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            onBarCodeRead={data => {
              this.handleQRScan(data);
            }}
          />
        </View>
        {this.state.renderBox &&
          <Animated.View style={{ ...styles.cameraBox, opacity: this.state.cameraBoxOpacity }}>
            <View style={{ width: 200, height: 200, borderColor: "#f39c12", borderWidth: 1, borderStyle: "solid", backgroundColor: "transparent" }}></View>
            <Text style={{ textAlign: "center", color: "#fff", opacity: 0.5, fontSize: 18 }}>Scan QR Code</Text>
          </Animated.View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#065471",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },
  cameraBox: {
    position: "absolute"
  }
});