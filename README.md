# Gazer

A Utility Inventory Manager (UIM) Business Mobile App

*Gazer - a person who gazes, i.e. watches/browses*

**To-Do:**

- [x] Register Firebase account and setup work environment
- [x] Make basic App template/skeleton
- [x] Implement the screens from the general design of the App
- [x] Style App and establish App theme
- [x] Complete Login system
- [x] Complete Register system
- [x] Complete Image upload on Register
- [x] Implement Profile screen header
- [x] Configure email verification and add email verification screen
- [x] Implement forgotten password system
- [x] Implement email-verified-only features for profiles
- [ ] Add Item display, creation, edition, and deletion system
- [x] Implement search system for items
- [x] Complete QR Code Scanner for items
- [x] Implement Admin profiles
- [x] Add Admin Control Panel
- [ ] Polish app (broad)  

**Sample Images from App**

<img src="media/Screenshots/LoginScreen.png" alt="Login Screen" width="270" height="480"> <img src="media/Screenshots/RegisterScreen.png" alt="Register Screen" width="270" height="480"> <img src="media/Screenshots/ResetPassScreen.png" alt="Reset Password Screen" width="270" height="480"> <br/><img src="media/Screenshots/HomeScreen.png" alt="Home Screen" width="270" height="480"> <img src="media/Screenshots/ItemsScreen.png" alt="Item List Screen" width="270" height="480"> <img src="media/Screenshots/ProfileScreen.png" alt="Profile Screen" width="270" height="480"> <br/><img src="media/Screenshots/ItemScreen.png" alt="Individual Item Screen" width="270" height="480"> <img src="media/Screenshots/AddItemScreen.png" alt="Add Item Screen" width="270" height="480"> <br/>

# How to run

1. `npm install` - Install required dependencies
2. `cd android && .\gradlew clean` - Rebuild Android Source
3. `react-native link` - Link dependencies with React Native
4. `react-native run-android` or `react-native run-ios` on iOS - Run the app on an Android Studio Emulator or a connected device with USB debugging enabled

One liner (Windows): `npm i; cd android; .\gradlew clean; cd ..; react-native link; react-native run-android`/run-ios
