import React from "react";
import { View } from "react-native";
import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation";
import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import { Transition } from "react-native-reanimated";
import { Icon } from "react-native-elements";

import HomeScreen from "./src/screens/HomeScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ItemsScreen from "./src/screens/ItemsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ResetPassScreen from "./src/screens/ResetPassScreen";

import "./src/fixTimerBug";

const LoginRegisterStack = createStackNavigator({ Login: { screen: LoginScreen }, Register: { screen: RegisterScreen }, ResetPass: { screen: ResetPassScreen }});
const AuthLoadingStack = createStackNavigator({ Loading: { screen: LoadingScreen } });

const AuthSwitch = createSwitchNavigator({ LoginRegister: { screen: LoginRegisterStack }, Loading: { screen: AuthLoadingStack } }, { initialRouteName: "Loading" })

const HomeStack = createStackNavigator({Home: { screen: HomeScreen }});
const ItemsStack = createStackNavigator({Items: { screen: ItemsScreen }});
const ProfileStack = createStackNavigator({Profile: { screen: ProfileScreen }});

const AppTabs = createMaterialTopTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon color={tintColor} type="material" name="home" />
          </View>
        )
      }
    },
    Items: {
      screen: ItemsStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon color={tintColor} type="material" name="toc" />
          </View>
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon color={tintColor} type="material" name="person" />
          </View>
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    activeColor: "#3fb0fc",
    inactiveColor: "#222",
    barStyle: { backgroundColor: "#076c91" },
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      tabStyle: {
        marginBottom: -10
      }
    }
  }
);

export default createAppContainer(
  createAnimatedSwitchNavigator(
    {
      App: AppTabs,
      Auth: AuthSwitch
    },
    {
      initialRouteName: "Auth"
    }
  )
);
