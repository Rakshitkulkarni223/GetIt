import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, TextInput, View, Button, StyleSheet, SafeAreaView, Modal, PermissionsAndroid, Alert } from 'react-native';

import ItemsListViewUsers from '../ListView/ItemListViewUsers';

import { app, auth, db, database } from "../Firebase";
import { ref, set, update, onValue } from "firebase/database";


import { Entypo, MaterialCommunityIcons, FontAwesome5, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import PaymentGateway from '../Payment';
import DetectLocation from './DetectLocation';


const Tab = createBottomTabNavigator();

function MyTabs({ navigation, AllConfirmedItems, totalamount, OrderId, displayCurrentAddress, setDisplayCurrentAddress,longitude,setlongitude,latitude,setlatitude }) {

   return (
      <Tab.Navigator
         initialRouteName="View Items"
         screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            headerShown: false
         }}
      >
         <Tab.Screen
            name="View Confirmed Items"
            children={() => <ItemsListViewUsers DATA={AllConfirmedItems} OrderId={OrderId} totalamount={totalamount} qtyhandler={true} showfooter={false}/>}
            options={{
               tabBarLabel: 'View Confirmed Items',
               tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="preview" color={color} size={size} />
               ),
            }}
         />
         <Tab.Screen
            name="Detect Location"
            children={() => <DetectLocation
               navigation={navigation}
               displayCurrentAddress={displayCurrentAddress}
               setDisplayCurrentAddress={setDisplayCurrentAddress}
               longitude={longitude}
               setlongitude={setlongitude}
               latitude={latitude}
               setlatitude={setlatitude}
            />}
            options={{
               tabBarLabel: 'Detect Location',
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="location" color={color} size={size} />
               ),
            }}
         />
         <Tab.Screen
            name="Payment Gateway"
            children={() => <PaymentGateway navigation={navigation}
               totalamount={totalamount}
               OrderId={OrderId}
               AllConfirmedItems={AllConfirmedItems}
               displayCurrentAddress={displayCurrentAddress}
               setDisplayCurrentAddress={setDisplayCurrentAddress}
               longitude={longitude}
               setlongitude={setlongitude}
               latitude={latitude}
               setlatitude={setlatitude}
            />}
            listeners={({ navigation, route }) => ({
               tabPress: e => {
                  {
                     displayCurrentAddress!=='' ?
                        Alert.alert('Delivery Location', `${displayCurrentAddress}`, [
                           {
                              text: 'Want to change?',
                              onPress: () => navigation.navigate("Detect Location"),
                              style: 'cancel',
                           },
                           {
                              text: 'want to proceed', onPress: () =>
                                 Alert.alert('Delivery Location Confirmed', `${displayCurrentAddress}`,
                                    [
                                       {
                                          text: 'OK',
                                       }
                                    ])
                           },
                        ])
                        : Alert.alert('Location Not Found', 'Please add location to proceed...', [
                           {
                              text: 'OK',
                              onPress: () => navigation.navigate("Detect Location"),
                           },
                        ])
                  }
               }
            })}
            options={{
               tabBarLabel: 'Payment Gateway',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="cc-amazon-pay" color={color} size={size} />
               ),
            }}
         />

      </Tab.Navigator>
   );
}

const ConfiremdOrders = ({ navigation, route }) => {

   const [AllConfirmedItems, setAllConfirmedItems] = useState([]);

   const [OrderId, setOrderId] = useState(route.params.OrderId);

   const [itemsList, setitemsList] = useState(ref(database, `users/orders/${OrderId}/items/`));

   const [totalamount, settotalamount] = useState(0);

   const [displayCurrentAddress, setDisplayCurrentAddress] = useState('');

   const [longitude, setlongitude] = useState('');

   const [latitude, setlatitude] = useState('');

   var amount = 0;

   useEffect(() => {


      onValue(itemsList, (snapshot) => {
         var items = [];
         var count = true;
         snapshot.forEach((child) => {
            count = true;
            child.forEach((it) => {
               if (it.val().ItemQuantity >= 1) {

                  var ItemId = it.key;
                  var ItemName = it.val().ItemName;
                  var ItemDesc = it.val().ItemDesc;
                  var ItemCategory = it.val().ItemCategory;
                  var ItemPrice = it.val().ItemPrice;
                  var ItemImage = it.val().ItemImage;
                  var ItemQuantity = it.val().ItemQuantity;
                  var ItemAddedDate = it.val().ItemAddedDate;

                  amount += (ItemPrice * ItemQuantity);

                  items.push({
                     displaycategory: count,
                     key: ItemId,
                     ItemName: ItemName,
                     ItemDesc: ItemDesc,
                     ItemCategory: ItemCategory,
                     ItemPrice: ItemPrice,
                     ItemImage: ItemImage,
                     ItemQuantity: ItemQuantity,
                     ItemAddedDate: ItemAddedDate,
                     OrderConfirmed: true,
                     OrderDelivered: false,
                     OrderPending: true
                  })
               }
               count = false;
            })
         })
         setAllConfirmedItems(items);
         settotalamount(amount);
      });
   }, [])

   return (

      <SafeAreaView style={styles.mainBody}>
         <NavigationContainer independent={true}>
            <MyTabs navigation={navigation}
               AllConfirmedItems={AllConfirmedItems}
               totalamount={totalamount}
               OrderId={OrderId}
               displayCurrentAddress={displayCurrentAddress}
               setDisplayCurrentAddress={setDisplayCurrentAddress}
               longitude={longitude}
               setlongitude={setlongitude}
               latitude={latitude}
               setlatitude={setlatitude}
            />
         </NavigationContainer>
      </SafeAreaView>
   )
}
export default ConfiremdOrders;

const styles = StyleSheet.create({
   container: {
      top: 400,
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 5,
   },
   mainBody: {
      flex: 1,
      bottom: 4,
      //   justifyContent: "center",
      backgroundColor: "white",
      //   alignContent: "center",
   },
   fab: {
      position: 'absolute',
      width: 150,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      left: 30,
      bottom: 30,
      backgroundColor: 'orange',
      borderRadius: 5,
      borderColor: "black",
      elevation: 8
   },
   fabIcon: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold'
   },

})