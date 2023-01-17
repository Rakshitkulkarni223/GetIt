import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, View, Button } from 'react-native';

import { onAuthStateChanged, signOut } from "firebase/auth";

import { app, auth, db, database, admins } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";
import { AntDesign } from '@expo/vector-icons';


import uuid from 'react-native-uuid';

const Home = ({ navigation }) => {

   const [user, setUser] = useState({ loggedIn: false });

   const [textbutton, setTextButton] = useState("");

   const [OrderId, setOrderId] = useState("");

   useEffect(() => {

      if (textbutton === "Login") {
         navigation.setOptions({
            headerRight: () => (
               <AntDesign name="login" size={24} color="black" onPress={() => navigation.navigate("Login")} />
            ),
         })
      }

      if (textbutton === "Logout") {
         const email = auth.currentUser.email;
         navigation.setOptions({
            headerRight: () => (
               <AntDesign name="logout" size={24} color="black" onPress={() => signOut(auth).then(() => {
                  alert(`${email}, you have successfully logged out!`);
               }).catch((error) => {
                  alert(`${email}, Logout Unsuccessfull!`);
               })} />
            ),
         })
      }
   }, [user])


   useEffect(() => {

      const unsubscribe = onAuthStateChanged(auth, (validuser) => {
         if (validuser) {
            const uid = validuser.uid;
            setTextButton("Logout");
            setUser({ loggedIn: true, email: validuser.email })
         } else {
            setTextButton("Login");
            setUser({ loggedIn: false })
         }
      });
      return () => {
         unsubscribe();
      }
   }, [])

   return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <TouchableOpacity style={{ margin: 128 }}>
            <Text>This is HOME!</Text>
         </TouchableOpacity>
         {user.loggedIn ? admins.includes(user.email) ? <Button title="Dashboard Admin" onPress={() => {
            navigation.navigate("Dashboard Admin")
         }
         } /> : <Button title="Dashboard User" onPress={() => {

            var OrderId = uuid.v4().substring(0,8);

            navigation.navigate("Dashboard User",{OrderId: OrderId})
         }
         } /> :
            <Button title="Login" onPress={() => {
               navigation.navigate("Login")
            }} />}
      </View>
   )
}
export default Home

