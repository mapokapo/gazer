import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Animated, Text, Vibration, StatusBar } from "react-native";
import Header from "../components/Header";
import { RNCamera } from "react-native-camera";
import firebase from "react-native-firebase";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      cameraBoxOpacity: new Animated.Value(1),
      renderBox: false,
      lastScan: ""
    };
    this._isMounted = false;
  }

  static navigationOptions = {
    header: (<Header />)
  };

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted)
        this.setState({ renderBox: true });
    }, 1000);
    if (this._isMounted) {
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
        )
      ).start();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleQRScan = data => {
    if (data.data !== this.state.lastScan) {
      this.setState({ lastScan: data.data }, () => {
        Vibration.vibrate(500);
        firebase.database().ref("items/").orderByChild("QRCodeURL").equalTo(data.data).once("value", snapshot => {
          if (snapshot.val() && this._isMounted)
            this.props.navigation.navigate("Loading", { data: snapshot.val() });
        });
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#065471" barStyle="light-content" />
        <View style={{ width: Dimensions.get("window").width/100*80, height: Dimensions.get("window").height/100*65, borderRadius: 15, overflow: "hidden", borderColor: "#f39c12", borderWidth: 1, borderStyle: "dashed" }}>
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
            <View style={{ width: 150, height: 150, borderColor: "#f39c12", borderWidth: 1, borderStyle: "solid", backgroundColor: "transparent" }}></View>
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