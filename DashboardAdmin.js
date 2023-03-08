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
} from "react-native";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from './Firebase';
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import AddItem from "./admin/AddItem";
import ViewItems from "./admin/ViewItems"
import PendingOrders from "./admin/PendingOrders";
import ConfirmedOrders from "./admin/ConfiremdOrders";
import ActivityIndicatorElement from "./ActivityIndicatorElement";
import { Alert } from "react-native";
import { normalize } from "./FontResize";
import { scale, verticalScale } from "./Dimensions";



const Tab = createBottomTabNavigator();

function MyTabs() {

    return (
        <Tab.Navigator
            initialRouteName="View Items"
            screenOptions={{
                tabBarLabelStyle: {
                    marginBottom: verticalScale(3),
                    fontSize: normalize(10),
                    letterSpacing: scale(0.4),
                    fontWeight: '500'
                },
                tabBarVisibilityAnimationConfig: {
                    show: false,
                    hide: true,
                },
                tabBarInactiveTintColor: '#000',
                tabBarActiveTintColor: '#6D9791',
                tabBarLabelPosition: 'below-icon',
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
        >
            <Tab.Screen
                name="Add Item"
                component={AddItem}
                options={{
                    tabBarLabel: 'Add Item',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={color !== "#000" ? "ios-add-circle" : "ios-add-circle-outline"} size={normalize(size-6)} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="View Items"
                component={ViewItems}
                options={{
                    tabBarLabel: 'View Items',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name={color !== '#000' ? "view-list": "view-list-outline"} size={normalize(size-5)} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Orders"
                component={PendingOrders}
                options={{
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={color !== "#000" ? "md-basket" : "md-basket-outline"} size={color !== '#000' ? normalize(size-4) : normalize(size-6)} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}


const DashboardAdmin = ({ navigation, route }) => {

    const [user, setUser] = useState({ loggedIn: false });

    const [textbutton, setTextButton] = useState("");

    const [loading, setloading] = useState(false);

    

    // useEffect(() => {
    //     try {
    //         const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
    //         navigation.setOptions({
    //             headerShown: true,
    //             title: 'Dashboard Admin',
    //             headerRight: () => (
    //                 <AntDesign name="logout" size={normalize(20)} color="black" onPress={() => signOut(auth).then(() => {
    //                     Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
    //                     navigation.reset({
    //                         index: 0,
    //                         routes: [{ name: 'Main' }],
    //                     });
    //                 }).catch((error) => {
    //                     Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
    //                 })} />
    //             ),
    //         })
    //     }
    //     catch (error) {
    //         setUser({ loggedIn: false })
    //     }
    // }, [])

    

    useEffect(() => {
        try {
            const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
            navigation.setOptions({
                headerShown: true,
                title: 'Dashboard Admin',
                headerStyle: {
                    backgroundColor: '#6D9791',
                    // height: 210,
                    // backgroundColor: '#6575CF',
                },
                headerTitleStyle: {
                    fontSize: normalize(15),
                    fontWeight: '600',
                    // color: '#334D97'
                    color: '#fff'
                },
                headerRight: () => (
                    <AntDesign name="logout" size={normalize(18)} color="#BF0505" onPress={() => signOut(auth).then(() => {
                        Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        });
                    }).catch((error) => {
                        Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                    })} />
                ),
                headerLeft: ()=> (<></>)
            })
        }
        catch (error) {
            setUser({ loggedIn: false })
        }
    }, [user])


    useEffect(() => {
        try {
            const unsubscribe = onAuthStateChanged(auth, (validuser) => {
                if (validuser) {
                    const uid = validuser.uid;
                    // setOrderId(uuid.v4().substring(0, 8));
                    setUser({ loggedIn: true, phoneNumber: validuser.phoneNumber })
                } else {
                    setUser({ loggedIn: false })
                }

            });
            return () => {
                unsubscribe();
            }
        }
        catch (error) {
            setUser({ loggedIn: false })
        }
    }, [])

    return (
        <SafeAreaView style={styles.mainBody}>
            <ActivityIndicatorElement loading={loading} />
            <NavigationContainer independent={true}>
                <MyTabs 
                />
            </NavigationContainer>
        </SafeAreaView>
    );
};
export default DashboardAdmin;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1
    },
});