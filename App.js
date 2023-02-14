// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import React, { useState } from "react";
import { StyleSheet, Text, View, AppRegistry } from "react-native";

import { NativeRouter, Route, Link, Routes } from "react-router-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Home";
import SignUp from "./Signup";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";
import ConfiremdOrders from "./users/ConfiremdOrders";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithOTP from "./LoginWithOTP";
import UserProfile from "./UserProfile";
import UserChangePassword from "./UserChangePassword";
import { normalize } from "./FontResize";
import Main from "./Main";
import Verification from "./Verification";
import DetectLocation from "./users/DetectLocation";
import PaymentGateway from "./Payment";

const Stack = createNativeStackNavigator();


const App = () => (


  // <NativeRouter>
  //   <View style={styles.container}>
  //     <View style={styles.nav}>
  //       <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
  //         <Text>Home</Text>
  //       </Link>
  //       <Link to="/about" underlayColor="#f0f4f7" style={styles.navItem}>
  //         <Text>About</Text>
  //       </Link>
  //       <Link to="/login" underlayColor="#f0f4f7" style={styles.navItem}>
  //         <Text>Login</Text>
  //       </Link>
  //     </View>
  //     <Routes>
  //       <Route exact path="/" element={<Home />} />
  //       <Route path="/about" element={<About />} />
  //       <Route path="/login" element={<Login />} />
  //     </Routes>
  //   </View>
  // </NativeRouter>
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Main" 
    >
      <Stack.Screen name="Main" component={Main}  />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LoginWithEmail" component={LoginWithEmail} />
      <Stack.Screen name="LoginWithOTP" component={LoginWithOTP} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Dashboard Admin" component={DashboardAdmin} />
      <Stack.Screen name="Dashboard User" component={DashboardUser} />
      <Stack.Screen name="Loaction" component={DetectLocation} />
      <Stack.Screen name="Confirm Order" component={ConfiremdOrders} />
      <Stack.Screen name="Payment Gateway" component={PaymentGateway} />
      <Stack.Screen name="User Profile" component={UserProfile} />
      <Stack.Screen name="Change Password" component={UserChangePassword} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    fontSize: normalize(15)
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  }
});

export default App;