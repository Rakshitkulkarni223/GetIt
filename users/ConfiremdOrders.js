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
import ActivityIndicatorElement from '../ActivityIndicatorElement';
import { normalize } from '../FontResize';


const Tab = createBottomTabNavigator();

function MyTabs({ navigation, loading, setloading, AllConfirmedItems, totalamount, OrderId, displayCurrentAddress, setDisplayCurrentAddress, longitude, setlongitude, latitude, setlatitude }) {

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
            children={() => <ItemsListViewUsers DATA={AllConfirmedItems} OrderId={OrderId} totalamount={totalamount} qtyhandler={true} showfooter={false} loading={loading} setloading={setloading} />}
            options={{
               tabBarLabel: 'View Confirmed Items',
               tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="preview" color={color} size={normalize(size-5)} />
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
               loading={loading}
               setloading={setloading}
            />}
            options={{
               tabBarLabel: 'Detect Location',
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="location" color={color} size={normalize(size-5)} />
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
                     displayCurrentAddress !== '' ?
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
                  <FontAwesome5 name="cc-amazon-pay" color={color} size={normalize(size-5)} />
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

   const [loading, setloading] = useState(false);

   var amount = 0;

   var adminRatings = '';

   useEffect(() => {
      setloading(true)
      const getRating = onValue(ref(database, `adminItemRatings/`),
         (snapshot) => {
            if (snapshot.exists()) {
               adminRatings = snapshot.val();
            }
            setloading(false)
         })
      return () => {

         getRating();
      }
   }, [])

   useEffect(() => {

      setloading(true)

      onValue(itemsList, (snapshot) => {
         var items = [];
         var count = true;
         snapshot.forEach((child) => {
            count = true;
            child.forEach((it) => {

               var ItemRating = 0;
               var ItemTotalRating = 0

               var totalUsers = 0;


               if (it.val().ItemQuantity >= 1) {

                  if (adminRatings && adminRatings.hasOwnProperty(it.key)) {
                     ItemTotalRating = adminRatings[it.key]["Rating"]
                     totalUsers = adminRatings[it.key]["TotalUsers"]
                  }

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
                     TotalRating: ItemTotalRating,
                     totalUsers: totalUsers,
                     avgRating: totalUsers === 0 ? 0 : Math.round(ItemTotalRating / totalUsers * 100) / 100,
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
         setloading(false)
      });
   }, [])

   return (
      <>

         <SafeAreaView style={styles.mainBody}>
            {/* <ActivityIndicatorElement loading={loading} /> */}
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
                  loading={loading}
                  setloading={setloading}
               />
            </NavigationContainer>
         </SafeAreaView>

      </>
   )
}
export default ConfiremdOrders;

const styles = StyleSheet.create({
   mainBody: {
      flex: 1,
      bottom: '0.1%',
      //   justifyContent: "center",
      backgroundColor: "white",
      //   alignContent: "center",
   },
})