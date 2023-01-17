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

function MyTabs({ navigation, AllConfirmedItems, totalamount, OrderId, displayCurrentAddress, setDisplayCurrentAddress }) {

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
            children={() => <ItemsListViewUsers DATA={AllConfirmedItems} OrderId={OrderId} totalamount={totalamount} qtyhandler={false} showfooter={false}/>}
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
               displayCurrentAddress={displayCurrentAddress}
               setDisplayCurrentAddress={setDisplayCurrentAddress}
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


// const ModalInput = ({ setvalues, onSubmit, visible, values, toggle }) => {
//    return (
//       <Modal visible={visible} transparent={true} style={{ justifyContent: 'center' }}>
//          <View
//             style={{
//                height: 270,
//                padding: 20,
//                bottom: 0,
//                position: 'absolute',
//                width: '100%',
//                alignSelf: 'center',
//                justifyContent: 'center',
//                backgroundColor: 'white',
//                borderRadius: 3,
//                borderColor: 'black',
//                borderWidth: 2,
//             }}>
//             <View style={{ marginTop: 10 }}>
//                <TextInput
//                   value={values.housename}
//                   onChangeText={(housename) =>
//                      setvalues.sethousename(housename)
//                   }
//                   placeholder={'Enter  compartment/house name..'}
//                   style={{
//                      color: "black",
//                      paddingLeft: 15,
//                      paddingRight: 15,
//                      borderWidth: 1,
//                      borderRadius: 10,
//                      borderColor: "red",
//                   }}
//                />
//             </View>
//             <View style={{ marginTop: 10 }}>
//                <TextInput
//                   value={values.streetname}
//                   onChangeText={(streetname) =>
//                      setvalues.setstreetname(streetname)
//                   }
//                   placeholder={'Enter street name...'}
//                   style={{
//                      color: "black",
//                      paddingLeft: 15,
//                      paddingRight: 15,
//                      borderWidth: 1,
//                      borderRadius: 10,
//                      borderColor: "red",
//                   }}
//                />
//             </View>

//             <View style={{ marginTop: 10 }}>
//                <TextInput
//                   value={values.cityname}
//                   onChangeText={(cityname) =>
//                      setvalues.setcityname(cityname)
//                   }
//                   placeholder={'Enter city and state name...'}
//                   style={{
//                      color: "black",
//                      paddingLeft: 15,
//                      paddingRight: 15,
//                      borderWidth: 1,
//                      borderRadius: 10,
//                      borderColor: "red",
//                   }}
//                />
//             </View>

//             <View style={{ marginTop: 10 }}>
//                <TextInput
//                   value={values.postalcode}
//                   onChangeText={(postalcode) =>
//                      setvalues.setpostalcode(postalcode)
//                   }
//                   placeholder={'Enter postal code...'}
//                   style={{
//                      color: "black",
//                      paddingLeft: 15,
//                      paddingRight: 15,
//                      borderWidth: 1,
//                      borderRadius: 10,
//                      borderColor: "red",
//                   }}
//                />
//             </View>
//             <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 40 }}>
//                <View style={{ marginRight: 20 }}>
//                   <Button title="Cancel" onPress={toggle} />
//                </View>
//                <View style={{ marginLeft: 20 }}>
//                   <Button title="set location" onPress={onSubmit} />
//                </View>
//             </View>
//          </View>
//       </Modal>
//    );
// };


// const DetectLocation = ({ displayCurrentAddress, setDisplayCurrentAddress }) => {

//    const [longitude, setlongitude] = useState('');
//    const [latitude, setlatitude] = useState('');

//    const [visible, setVisible] = useState(false);
//    const [housename, sethousename] = useState('');
//    const [streetname, setstreetname] = useState('');
//    const [postalcode, setpostalcode] = useState('');
//    const [cityname, setcityname] = useState('');

//    useEffect(() => {
//       GetCurrentLocation();
//    }, [])



//    const GetCurrentLocation = async () => {

//       setlatitude("");
//       setlongitude("");
//       setDisplayCurrentAddress('');

//       try {

//          let { coords } = await Location.getCurrentPositionAsync();

//          // console.log(coords)

//          if (coords) {
//             const { latitude, longitude } = coords;
//             setlatitude(latitude);
//             setlongitude(longitude);
//             let response = await Location.reverseGeocodeAsync({
//                latitude,
//                longitude
//             });

//             for (let item of response) {
//                let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
//                setDisplayCurrentAddress(address);
//             }
//          }
//       }
//       catch (e) {
//          alert(
//             'Location Permission not granted.Please enable location Permission'
//          );
//       }
//    };

//    const getLocationFromAddress = async () => {

//       setlatitude("");
//       setlongitude("");
//       setDisplayCurrentAddress('');
//       // let {location} =  await Location.geocodeAsync(`${housename} ${streetname} ${cityname} ${postalcode}`)

//       let { coords } = await Location.geocodeAsync('1 Hacker Way');
//       console.log(coords)
//       // console.log(cityname, postalcode,housename,streetname)
//       setDisplayCurrentAddress(`${housename} ${streetname} ${cityname} ${postalcode}`)
//       if (coords) {
//          const { latitude, longitude } = coords;
//          console.log(latitude, longitude)
//          setlatitude(latitude);
//          setlongitude(longitude);
//       }
//       setVisible(!visible)
//    }


//    return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

//          <Text style={{ margin: 10 }}>{displayCurrentAddress}</Text>
//          <Text style={{ margin: 10 }}>{latitude}</Text>
//          <Text style={{ margin: 10 }}>{longitude}</Text>

//          <ModalInput
//             visible={visible}
//             values={{
//                housename: housename,
//                cityname: cityname,
//                streetname: streetname,
//                postalcode: postalcode
//             }}

//             setvalues={{
//                sethousename: sethousename,
//                setcityname: setcityname,
//                setstreetname: setstreetname,
//                setpostalcode: setpostalcode
//             }}
//             toggle={() => setVisible(!visible)}
//             onSubmit={getLocationFromAddress}
//          />

//          <View style={styles.container}>
//             <View style={{
//                flex: 1,
//                alignItems: "flex-start",
//             }}>
//                <View>
//                   <TouchableOpacity onPress={() => GetCurrentLocation()}
//                   // style={styles.fab}
//                   >
//                      <Text
//                      // style={styles.fabIcon}
//                      >Detect Location</Text>
//                   </TouchableOpacity>
//                </View>
//             </View>

//             <View style={{
//                flex: 1,
//                alignItems: "flex-end",
//             }}>
//                <View>
//                   <TouchableOpacity onPress={() => setVisible(!visible)}
//                   // style={styles.fab}
//                   >
//                      <Text
//                      // style={styles.fabIcon}
//                      >Enter Location Manually</Text>
//                   </TouchableOpacity>
//                </View>
//             </View>
//          </View>

//       </SafeAreaView>
//    )
// }

const ConfiremdOrders = ({ navigation, route }) => {

   const [AllConfirmedItems, setAllConfirmedItems] = useState([]);

   const [OrderId, setOrderId] = useState(route.params.OrderId);

   const [itemsList, setitemsList] = useState(ref(database, `users/orders/${OrderId}/items/`));

   const [totalamount, settotalamount] = useState(0);

   const [displayCurrentAddress, setDisplayCurrentAddress] = useState('');

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