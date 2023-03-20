import React, { useState, createRef, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Button,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    Modal,
    StatusBar,
} from "react-native";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { AntDesign, Entypo, EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { scale, moderateScale, verticalScale } from './Dimensions';

import { normalize } from "./FontResize";

import ViewItems from "./users/ViewItems";

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";
import UsersCompletedOrders from "./users/UsersCompletedOrders";
import UserAccountDetails from "./UserAccountDetails";
import UserPendingOrders from "./users/UserPendingOrders";
import ActivityIndicatorElement from "./ActivityIndicatorElement";

import uuid from 'react-native-uuid';

import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();

function MyTabs({ navigation, OrderId, displayCurrentAddress, longitude, latitude, adminList }) {

    return (
        <Tab.Navigator
            initialRouteName="All Items"
            screenOptions={{
                tabBarLabelStyle: {
                    marginBottom: verticalScale(3),
                    fontSize: normalize(10),
                    letterSpacing: scale(0.4),
                    fontWeight: '400'
                },
                tabBarInactiveTintColor: '#000',
                tabBarActiveTintColor: '#393B72',
                tabBarLabelPosition: 'below-icon',
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
        >
            <Tab.Screen
                name="All Items"
                children={() => <ViewItems navigation={navigation} OrderId={OrderId} displayCurrentAddress={displayCurrentAddress} longitude={longitude} adminList={adminList}
                    latitude={latitude} />}
                options={{
                    tabBarLabel: "All Items",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name={color !== '#000' ? "view-list": "view-list-outline"} size={normalize(size-5)} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Orders"
                children={() => <UsersCompletedOrders navigation={navigation} OrderId={OrderId} adminList={adminList} />}
                options={{
                    tabBarLabel: "Orders",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={color !== '#000' ? "basket" : "basket-outline"} color={color} size={color !== '#000' ? normalize(size-4) : normalize(size-6)} />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                children={() => <UserAccountDetails navigation={navigation} displayCurrentAddress={displayCurrentAddress}
                    longitude={longitude}
                    latitude={latitude} />}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name={color !== '#000' ? "account-circle": "account-circle-outline"} color={color} size={normalize(size - 7)} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}



const ModalInput = ({ setvalues, onSubmit, visible, values, toggle }) => {



    return (
        <Modal visible={visible} transparent={true} style={{
            justifyContent: 'center'
        }}>
            <View
                style={{
                    flex: 1,
                    // height: verticalScale(215),
                    paddingTop: scale(10),
                    paddingBottom: scale(15),
                    paddingRight: scale(15),
                    paddingLeft: scale(15),
                    // bottom: verticalScale(0),
                    // position: 'absolute',
                    // width: '100%',
                    // alignSelf: 'center',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    backgroundColor: 'white',
                    // borderRadius: scale(3),
                    // borderColor: 'black',
                    // borderWidth: scale(1),
                }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(15),
                }}>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Feather name="chevron-down" size={normalize(20)} color="black" onPress={toggle} />
                    </View>
                    <View style={{
                        paddingLeft: scale(5),
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: normalize(15),
                            lineHeight: scale(18),
                            letterSpacing: scale(0.5),
                            color: 'black',
                        }}
                            onPress={toggle}>
                            Select a location
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: verticalScale(5),
                    paddingHorizontal: scale(2),
                    borderRadius: scale(4),
                    elevation: scale(10),
                    marginTop: verticalScale(10),
                    // marginBottom: scale(25),
                    backgroundColor: 'black',
                }}>
                    <View>
                        <MaterialCommunityIcons name="target" size={scale(20)} color="red" onPress={() => {
                            onSubmit("automatic")
                            toggle()
                        }} />
                    </View>
                    <View style={{ paddingLeft: scale(10), }}>
                        <TouchableOpacity onPress={() => {
                            onSubmit("automatic")
                            toggle()
                        }}>
                            <Text style={styles.text}>DETECT LOCATION</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: verticalScale(20),
                }}>
                    <Text style={{
                        fontSize: normalize(15),
                        lineHeight: scale(18),
                        fontWeight: '600',
                        letterSpacing: scale(0.5),
                        color: 'black',
                    }}>OR</Text>
                </View>
                <View>
                    <Text style={{
                        fontSize: normalize(15),
                        fontWeight: '600'
                    }}>Add Location Information Manually</Text>

                    <View
                        style={{ marginTop: scale(12) }}
                    >
                        <TextInput
                            value={values.housename}
                            onChangeText={(housename) =>
                                setvalues.sethousename(housename)
                            }
                            // autoFocus
                            placeholder={'Enter compartment/house name..'}
                            ref={values.houseNameRef}
                            clearButtonMode="always"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                values.streetNameRef.current && values.streetNameRef.current.focus()
                            }
                            blurOnSubmit={false}
                            style={styles.locationInfo}
                        />
                    </View>
                    <View style={{ marginTop: scale(12) }}>
                        <TextInput
                            value={values.streetname}
                            onChangeText={(streetname) =>
                                setvalues.setstreetname(streetname)
                            }
                            ref={values.streetNameRef}
                            clearButtonMode="always"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                values.cityNameRef.current && values.cityNameRef.current.focus()
                            }
                            blurOnSubmit={false}
                            placeholder={'Enter street name...'}
                            style={styles.locationInfo}
                        />
                    </View>

                    <View style={{ marginTop: scale(12) }}>
                        <TextInput
                            value={values.cityname}
                            onChangeText={(cityname) =>
                                setvalues.setcityname(cityname)
                            }
                            placeholder={'Enter city and state name...'}
                            ref={values.cityNameRef}
                            clearButtonMode="always"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                values.postalCodeRef.current && values.postalCodeRef.current.focus()
                            }
                            blurOnSubmit={false}
                            style={styles.locationInfo}
                        />
                    </View>

                    <View style={{ marginTop: scale(12) }}>
                        <TextInput
                            value={values.postalcode}
                            onChangeText={(postalcode) =>
                                setvalues.setpostalcode(postalcode)
                            }
                            autoCompleteType="tel"
                            keyboardType="phone-pad"
                            textContentType="telephoneNumber"
                            ref={values.postalCodeRef}
                            clearButtonMode="always"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            placeholder={'Enter postal code...'}
                            style={styles.locationInfo}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: scale(30), marginBottom: scale(5) }}>
                    <View style={{
                        marginRight: scale(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: verticalScale(7),
                        paddingHorizontal: scale(30),
                        borderRadius: scale(4),
                        elevation: scale(10),
                        backgroundColor: 'black',
                    }}>
                        <TouchableOpacity onPress={toggle}>
                            <Text style={{
                                fontSize: normalize(13),
                                lineHeight: scale(18),
                                fontWeight: 'bold',
                                letterSpacing: scale(1),
                                color: 'white',
                            }}>CANCEL</Text>
                        </TouchableOpacity>
                        {/* <Button title="set location" onPress={onSubmit} /> */}
                    </View>
                    <View style={{
                        marginLeft: scale(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: verticalScale(7),
                        paddingHorizontal: scale(20),
                        borderRadius: scale(4),
                        elevation: scale(10),
                        backgroundColor: 'black',
                    }}>
                        <TouchableOpacity onPress={() => {
                            onSubmit("manual")
                            toggle()
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                lineHeight: scale(18),
                                fontWeight: 'bold',
                                letterSpacing: scale(1),
                                color: 'white',
                            }}>SET LOCATION</Text>
                        </TouchableOpacity>
                        {/* <Button title="set location" onPress={onSubmit} /> */}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const DashboardUser = ({ navigation, OrderId, displayCurrentAddress, setdisplayCurrentAddress, longitude, setlongitude, latitude, setlatitude, GetCurrentLocation, adminList }) => {

    // const [OrderId, setOrderId] = useState("");

    const [user, setUser] = useState({ loggedIn: false });

    const [loading, setloading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [housename, sethousename] = useState('');
    const [streetname, setstreetname] = useState('');
    const [postalcode, setpostalcode] = useState('');
    const [cityname, setcityname] = useState('');

    const houseNameRef = createRef("");
    const streetNameRef = createRef("");
    const cityNameRef = createRef("");
    const postalCodeRef = createRef("");


    useEffect(() => {
        // setVisible(false)
        try {
            setloading(true)
            const unsubscribe = onAuthStateChanged(auth, (validuser) => {
                if (validuser) {
                    const uid = validuser.uid;
                    setloading(false)
                    setUser({ loggedIn: true, phoneNumber: validuser.phoneNumber })
                } else {
                    setloading(false)
                    setUser({ loggedIn: false })
                }
            });
            return () => {
                unsubscribe();
            }
        }
        catch (error) {
            setloading(false);
            setUser({ loggedIn: false })
        }
    }, [])




    useEffect(() => {
        // setVisible(false)
        try {
            var address = 'Detecting Location';
            var addressNextLine = ''

            if (displayCurrentAddress) {
                address = '';
                var addressDetails = displayCurrentAddress.split(',')
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
                        <Ionicons name="ios-location-sharp" size={normalize(17)} color="#D00B0B" onPress={() => setVisible(!visible)} />
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingHorizontal: scale(3)
                    }}>
                        {
                            address !== 'Detecting Location' ?
                                <>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                    }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{
                                                fontWeight: '600',
                                                fontSize: normalize(14),
                                            }} onPress={() => setVisible(!visible)} >{address}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', paddingHorizontal: scale(2) }}>
                                            <Entypo name="chevron-small-down" size={normalize(20)} color="black"
                                                onPress={() => setVisible(!visible)} />
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                    }}>
                                        <Text style={{ fontSize: normalize(10), fontWeight: '500', color: 'white' }} onPress={() => setVisible(!visible)}>{addressNextLine}</Text>
                                    </View>
                                </>
                                : <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{
                                            fontWeight: '600',
                                            fontSize: normalize(14),
                                        }}
                                            onPress={() => setVisible(!visible)}
                                        >{address}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', paddingHorizontal: scale(2) }}>
                                        <Entypo name="chevron-small-down" size={normalize(20)} color="black" onPress={() => setVisible(!visible)} />
                                    </View>
                                </View>
                        }
                    </View>
                </View>,
                title: '',
                headerStyle: {
                    backgroundColor: '#8297C4',
                    backgroundColor: '#7FA09D',
                },
                headerRight: () => (
                    // <AntDesign name="logout" size={normalize(18)} color="#BF0505" onPress={() => signOut(auth).then(() => {
                    //     setloading(false)
                    //     Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
                    //     navigation.replace('Main')
                    // }).catch((error) => {
                    //     setloading(false)
                    //     Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                    // })} />
                    <></>
                ),

            })
        }
        catch (error) {
            // setloading(false)
            setUser({ loggedIn: false })
        }
    }, [displayCurrentAddress])


    const fetchLocation = async (type) => {

        if (type === 'automatic') {
            setlatitude("");
            setlongitude("");
            setdisplayCurrentAddress('');

            try {
                await Location.requestForegroundPermissionsAsync();
                let { coords } = await Location.getCurrentPositionAsync();

                if (coords) {
                    const { latitude, longitude } = coords;
                    setlatitude(latitude);
                    setlongitude(longitude);
                    let response = await Location.reverseGeocodeAsync({
                        latitude,
                        longitude
                    });

                    let address = '';
                    for (let place of response) {
                        if (place.name) {
                            address += place.name;
                            // placename = place.name
                        }
                        if (place.street) {
                            address += ', ' + place.street
                            // streename = place.street
                        }
                        if (place.city) {
                            address += ', ' + place.city
                            // cityname = place.city
                        }
                        if (place.postalCode) {
                            address += ', ' + place.postalCode
                        }
                    }
                    // setVisible(!visible)

                    // console.log(address)
                    // console.log(address)
                    // let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
                    setdisplayCurrentAddress(address);
                }
            }
            catch (e) {
                // console.log(e)
                // setVisible(!visible)
                Alert.alert('Permission Denied',
                    'Location Permission not granted.Please enable location Permission', [
                    {
                        text: 'OK',
                        onPress: async () => await Location.requestForegroundPermissionsAsync(),
                    },
                ]
                );
            }
        }
        else {

            setlatitude("");
            setlongitude("");
            setdisplayCurrentAddress('');
            // let {location} =  await Location.geocodeAsync(`${housename} ${streetname} ${cityname} ${postalcode}`)

            let { coords } = await Location.geocodeAsync('1 Hacker Way');
            //    console.log(coords)
            // console.log(cityname, postalcode,housename,streetname)

            if (`${housename}` === '') {
                Alert.alert('Location Not Found', 'Please enter compartment/house name', [
                    {
                        text: 'Ok',
                    },
                ])
                setdisplayCurrentAddress('');
                return;
            }
            if (`${streetname}` === '') {
                Alert.alert('Location Not Found', 'Please enter street name', [
                    {
                        text: 'Ok',
                    },
                ])
                setdisplayCurrentAddress('');
                return;
            }
            if (`${cityname}` === '') {
                Alert.alert('Location Not Found', 'Please enter city and state name', [
                    {
                        text: 'Ok',
                    },
                ])
                setdisplayCurrentAddress('');
                return;
            }
            if (`${postalcode}` === '') {
                Alert.alert('Location Not Found', 'Please enter postal code', [
                    {
                        text: 'Ok',
                    },
                ])
                setdisplayCurrentAddress('');
                return;
            }

            setdisplayCurrentAddress(`${housename}, ${streetname}, ${cityname}, ${postalcode}`)
            if (coords) {
                const { latitude, longitude } = coords;
                setlatitude(latitude);
                setlongitude(longitude);
            }
            // setVisible(!visible)

            sethousename('');
            setstreetname('');
            setcityname('');
            setpostalcode('');

        }
    }

    return (

        <SafeAreaView style={styles.mainBody}>

            <ActivityIndicatorElement loading={loading} />
            <NavigationContainer independent={true}>
                <MyTabs
                    navigation={navigation}
                    OrderId={OrderId}
                    displayCurrentAddress={displayCurrentAddress}
                    longitude={longitude}
                    latitude={latitude}
                    adminList={adminList}
                />
            </NavigationContainer>
            <ModalInput
                visible={visible}
                values={{
                    housename: housename,
                    cityname: cityname,
                    streetname: streetname,
                    postalcode: postalcode,
                    houseNameRef: houseNameRef,
                    cityNameRef: cityNameRef,
                    streetNameRef: streetNameRef,
                    postalCodeRef: postalCodeRef
                }}

                setvalues={{
                    sethousename: sethousename,
                    setcityname: setcityname,
                    setstreetname: setstreetname,
                    setpostalcode: setpostalcode
                }}
                toggle={() => setVisible(!visible)}
                onSubmit={(type) => {
                    fetchLocation(type)
                }}
            />
        </SafeAreaView>
    );
};
export default DashboardUser;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#307ecc",
        // backgroundColor: '#fff',
        alignContent: "center",
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(30),
        borderRadius: scale(4),
        elevation: scale(10),
        backgroundColor: 'black',
    },
    text: {
        fontSize: normalize(13),
        lineHeight: scale(18),
        fontWeight: '600',
        letterSpacing: scale(0.5),
        color: 'white',
    },
    locationInfo: {
        color: "black",
        paddingLeft: scale(10),
        paddingRight: scale(10),
        borderWidth: scale(1),
        borderRadius: scale(5),
        borderColor: "black",
    },
});