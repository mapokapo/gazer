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
import ItemScreen from "./src/screens/ItemScreen";

import "./src/fixTimerBug";

const LoginRegisterStack = createStackNavigator({ Login: { screen: LoginScreen }, Register: { screen: RegisterScreen }, ResetPass: { screen: ResetPassScreen }});
const AuthLoadingStack = createStackNavigator({ Loading: { screen: LoadingScreen } });

const AuthSwitch = createSwitchNavigator({ LoginRegister: { screen: LoginRegisterStack }, Loading: { screen: AuthLoadingStack } }, { initialRouteName: "Loading" })

const HomeStack = createStackNavigator({Home: { screen: HomeScreen }});
const ItemsStack = createStackNavigator({Items: { screen: ItemsScreen }, Item: { screen: ItemScreen } }, { initialRouteName: "Items" });
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
    barStyle: { backgroundColor: "#076c91" },
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#eee",
      inactiveTintColor: "#222",
      showIcon: true,
      tabStyle: {
        marginBottom: -15
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
