import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, TextInput, View, Button, StyleSheet, SafeAreaView, Modal, PermissionsAndroid, Alert } from 'react-native';

import ItemsListViewUsers from '../ListView/ItemListViewUsers';

import { app, auth, db, database } from "../Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, verticalScale } from '../Dimensions';

import { Entypo, MaterialCommunityIcons, FontAwesome5, SimpleLineIcons, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

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
                  <MaterialIcons name="preview" color={color} size={normalize(size - 5)} />
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
                  <Entypo name="location" color={color} size={normalize(size - 5)} />
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
                  <FontAwesome5 name="cc-amazon-pay" color={color} size={normalize(size - 5)} />
               ),
            }}
         />

      </Tab.Navigator>
   );
}

const ConfiremdOrders = ({ navigation, route }) => {

   const [AllConfirmedItems, setAllConfirmedItems] = useState([]);

   const [OrderId, setOrderId] = useState(route.params.OrderId);

   const [itemsList, setitemsList] = useState(ref(database, `users/${auth.currentUser.phoneNumber}/orders/${OrderId}/items/`));

   const [totalamount, settotalamount] = useState(0);


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
         setloading(false)
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

   useEffect(() => {
      // setVisible(false)
      try {
         var address = 'Detecting Location';
         var addressNextLine = ''

         if (route.params.displayCurrentAddress) {
            address = '';
            var addressDetails = route.params.displayCurrentAddress.split(',')
            let i = 0;

            for (i = addressDetails.length - 1; i > addressDetails.length - 3; i--) {
               if (i !== addressDetails.length - 1) {
                  addressNextLine = addressDetails[i] + addressNextLine
               }
               else {
                  addressNextLine = ',' + addressDetails[i] + addressNextLine
               }
            }
            addressNextLine = addressNextLine.trim();

            for (let j = 0; j <= i; j++) {
               if (j !== 0) {
                  address += ',' + addressDetails[j]
               }
               else {
                  address += addressDetails[j]
               }
            }
            address = address.trim()
         }
         const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);

         navigation.setOptions({
            headerShown: true,
            headerLeft: () => <View style={{
               flexDirection: 'row',
               justifyContent: 'flex-start'
            }}>
               <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center'
               }}>
                  <Ionicons name="arrow-back-sharp" size={normalize(21)} color="#fff"
                     onPress={() => {
                        navigation.goBack();
                     }} />
               </View>
               <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center'
               }}>
                  <Ionicons name="ios-location-sharp" size={normalize(17)} color="#D00B0B" onPress={() => {
                     Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                        {
                           text: 'Want to change?',
                           onPress: () =>  navigation.goBack(),
                           style: 'cancel',
                        },
                        {
                           text: 'want to proceed'
                        }
                     ])
                  }} />
               </View>
               <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingHorizontal: scale(3)
               }}>

                  <View style={{
                     flexDirection: 'row',
                     justifyContent: 'flex-start',
                  }}>
                     <View style={{ justifyContent: 'center' }}>
                        <Text style={{
                           fontWeight: '600',
                           fontSize: normalize(14)
                        }}
                           onPress={() => {
                              Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                                 {
                                    text: 'Want to change?',
                                    onPress: () => navigation.goBack(),
                                    style: 'cancel',
                                 },
                                 {
                                    text: 'want to proceed'
                                 }
                              ])
                           }}
                        >{address}</Text>
                     </View>
                  </View>
                  <View style={{
                     flexDirection: 'row',
                     justifyContent: 'flex-start',
                  }}>
                     <Text style={{ fontSize: normalize(10), color: "#fff" }} onPress={() => {
                        Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                           {
                              text: 'Want to change?',
                              onPress: () => navigation.goBack(),
                              style: 'cancel',
                           },
                           {
                              text: 'want to proceed'
                           }
                        ])
                     }} >{addressNextLine}</Text>
                  </View>

               </View>
            </View>,
            headerTitle: '',
            headerStyle: {
               backgroundColor: '#77C98D',
               backgroundColor: '#7FA09D',
           },
            // headerTintColor: '#fff',
            // headerTitleStyle: {
            //     fontSize: normalize(13),
            //     fontWeight: '600',
            //     color: 'black'
            // },
            headerRight: () => (
               // <AntDesign name="logout" size={normalize(18)} color="#BF0505" onPress={() => signOut(auth).then(() => {
               //    setloading(false)
               //    Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
               //    navigation.replace('Main')
               // }).catch((error) => {
               //    setloading(false)
               //    Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
               // })} />
               <></>
            ),

         })
      }
      catch (error) {
         // setloading(false)
         setUser({ loggedIn: false })
      }
   }, [route.params.displayCurrentAddress])



   return (
      <>

         <SafeAreaView style={styles.mainBody}>
            <ActivityIndicatorElement loading={loading} />
            <ItemsListViewUsers navigation={navigation}
               DATA={AllConfirmedItems}
               OrderId={OrderId}
               totalamount={totalamount}
               totalConfirmedItems={route.params.totalItems}
               qtyhandler={true}
               showfooter={false}
               loading={loading}
               setloading={setloading}
               displayCurrentAddress={route.params.displayCurrentAddress}
               longitude={route.params.longitude}
               latitude={route.params.latitude}
               adminList={route.params.adminList}
            />
            {/* <NavigationContainer independent={true}>
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
            </NavigationContainer> */}
         </SafeAreaView>

      </>
   )
}
export default ConfiremdOrders;

const styles = StyleSheet.create({
   mainBody: {
      flex: 1,
      //   justifyContent: "center",
      backgroundColor: "white",
      //   alignContent: "center",
   },
})