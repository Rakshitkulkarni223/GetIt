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
import Login from "./Login";
import SignUp from "./Signup";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";
import ConfiremdOrders from "./users/ConfiremdOrders";

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
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Dashboard Admin" component={DashboardAdmin} />
      <Stack.Screen name="Dashboard User" component={DashboardUser} />
      <Stack.Screen name="Confirm Order" component={ConfiremdOrders} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    fontSize: 20
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