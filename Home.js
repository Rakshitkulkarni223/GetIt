import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, ImageBackground, View, StyleSheet, Button, Alert, SafeAreaView, ScrollView, Modal, ActivityIndicator } from 'react-native';

import { onAuthStateChanged, signOut } from "firebase/auth";

import { app, auth, db, database, admins } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";
import { AntDesign } from '@expo/vector-icons';

import * as Location from 'expo-location';


import uuid from 'react-native-uuid';
import DashboardUser from './DashboardUser';
import DashboardAdmin from './DashboardAdmin';
import LoginWithOTP from './LoginWithOTP';
// import ActivityIndicatorElement from './ActivityIndicatorElement';
import SignUp from './Signup';
import * as Notifications from 'expo-notifications';

import { getToken, NotificationData, NotificationHandler, NotificationPermission } from './NotificationHandler';

const Home = ({ navigation, route }) => {

    const [user, setUser] = useState({ loggedIn: route && route.params ? true : false, gotoSignup: route && route.params ? route.params.gotoSignup : true });

    const [OrderId, setOrderId] = useState("");

    const [loading, setloading] = useState(false);

    const [displayCurrentAddress, setdisplayCurrentAddress] = useState(route && route.params ? route.params.Location : '');
    const [longitude, setlongitude] = useState(route && route.params ? route.params.Longitude : '');
    const [latitude, setlatitude] = useState(route && route.params ? route.params.Latitude : '');

    const [showAddress, setshowAddress] = useState(route && route.params ? route.params.changeAddress : true)


    const [adminList, setadminList] = useState([]);

    const [adminPhoneNumbers, setadminPhoneNumbers] = useState([]);

    var allAdmins = [];
    var phoneNumbersAdmin = [];

    useEffect(() => {

        const getAdminList = onValue(ref(database, `adminList/`), (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    phoneNumbersAdmin.push(child.key)
                    allAdmins.push({
                        phoneNumber: child.key,
                        fcmToken: child.val()["fcmToken"]
                    })
                })
                setadminList(allAdmins)
                setadminPhoneNumbers(phoneNumbersAdmin)
            }
        })

        return () => {
            getAdminList();
        }
    }, [])

    var username = 'User';

    var token = '';


    useEffect(() => {
        if (showAddress) {
            GetCurrentLocation();
        }
    }, [])

    const GetCurrentLocation = async () => {

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
                // console.log(address)
                // let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
                setdisplayCurrentAddress(address);
            }
        }
        catch (e) {
            Alert.alert('Permission Denied',
                'Location Permission not granted.Please enable location Permission', [
                {
                    text: 'OK',
                    onPress: async () => await Location.requestForegroundPermissionsAsync(),
                },
            ]
            );
        }
    };

    useEffect(() => {
        Notifications.addNotificationResponseReceivedListener(async (response) => {
            try {
                const url = response?.notification?.request?.content?.data?.url;
                // console.log(url)
                if (url) {
                    Linking.openURL(url);
                }
            }
            catch (error) {

            }
        });
    }, [])

    useEffect(() => {

        setloading(false)

        try {
            const addInfoUser = onValue(ref(database, 'users/'), (snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val()[auth.currentUser.phoneNumber]) {
                        setloading(false)
                        // console.log(snapshot.val()[auth.currentUser.phoneNumber])
                        username = (snapshot.val()[auth.currentUser.phoneNumber]['firstName']
                            + ' ' + snapshot.val()[auth.currentUser.phoneNumber]['lastName']
                        )
                        if (route && route.params && route.params.disableNotification) {
                            // console.log("ok")
                        }
                        else {
                            // NotificationHandler(`Hey, ${username}`, 'welocme back', 'Great to see you again!!');
                            // NotificationData()
                        }
                        setUser({ loggedIn: true, phoneNumber: auth.currentUser.phoneNumber, gotoSignup: false })
                    }
                    if (!snapshot.val()[auth.currentUser.phoneNumber]) {
                        setloading(false)
                        setUser({ loggedIn: true, phoneNumber: auth.currentUser.phoneNumber, gotoSignup: true })
                    }
                } else {
                    setloading(false)
                    setUser({ loggedIn: true, phoneNumber: auth.currentUser.phoneNumber, gotoSignup: true })
                }
            })
            return () => {
                addInfoUser()
            }
        }
        catch (error) {
            setloading(false)
            setUser({ loggedIn: false, gotoSignup: false })
        }
    }, [])

    useEffect(() => {

        setloading(true);

        const unsubscribe = onAuthStateChanged(auth, async (validuser) => {
            if (validuser) {
                const uid = validuser.uid;
                setOrderId(uuid.v4().substring(0, 8));
                setUser({ loggedIn: true, phoneNumber: validuser.phoneNumber })
                setloading(false);
                await NotificationPermission()
                var token = (await Notifications.getExpoPushTokenAsync()).data;
                if (!phoneNumbersAdmin.includes(validuser.phoneNumber)) {
                    await set(ref(database, `usersList/` + validuser.phoneNumber), {
                        fcmToken: token,
                    })
                }
            } else {
                setUser({ loggedIn: false })
            }

            setloading(false);
        });
        return () => {
            unsubscribe();
        }
    }, [])





    return (
        <>
            <Modal visible={loading} transparent={false}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator size="large" color="#2F66EE" animating={true} />
                </View>
            </Modal>

            {
                user.loggedIn ?
                    (adminPhoneNumbers.includes(user.phoneNumber)) ?
                        <DashboardAdmin navigation={navigation}></DashboardAdmin> :
                        user.gotoSignup ? <SignUp navigation={navigation} /> :
                            <DashboardUser
                                navigation={navigation}
                                OrderId={OrderId}
                                displayCurrentAddress={displayCurrentAddress}
                                setdisplayCurrentAddress={setdisplayCurrentAddress}
                                longitude={longitude}
                                setlongitude={setlongitude}
                                latitude={latitude}
                                setlatitude={setlatitude}
                                GetCurrentLocation={GetCurrentLocation}
                                adminList={adminList}
                            ></DashboardUser>
                    :
                    <>
                        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
                            <LoginWithOTP navigation={navigation}></LoginWithOTP>
                        </SafeAreaView>
                    </>
            }
        </>
    )
}
export default Home;


const styles = StyleSheet.create({
    sectionStyle: {
        flexDirection: "row",
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: "#7DE24E",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "#7DE24E",
        height: 40,
        alignItems: "center",
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "#dadae8",
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
});