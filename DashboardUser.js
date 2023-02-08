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
} from "react-native";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

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


const Tab = createBottomTabNavigator();

function MyTabs({ navigation, OrderId }) {

    return (
        <Tab.Navigator
            initialRouteName="All Items"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                headerShown: false
            }}
        >
            <Tab.Screen
                name="All Items"
                children={() => <ViewItems navigation={navigation} OrderId={OrderId} />}
                options={{
                    tabBarLabel: "All Items",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="preview" color={color} size={normalize(size - 6)} />
                    ),
                }}
            />

            <Tab.Screen
                name="Pending Orders"
                children={() => <UserPendingOrders navigation={navigation} />}
                options={{
                    tabBarLabel: "Pending Orders",
                    tabBarIcon: ({ color, size }) => (
                        // <Ionicons name="basket" color={color} size={size} />
                        <Feather name="shopping-bag" color={color} size={normalize(size - 8)} />
                    ),
                }}
            />

            <Tab.Screen
                name="Your Orders"
                children={() => <UsersCompletedOrders navigation={navigation} OrderId={OrderId} />}
                options={{
                    tabBarLabel: "Your Orders",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="basket" color={color} size={normalize(size - 3)} />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                children={() => <UserAccountDetails navigation={navigation} />}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-circle" color={color} size={normalize(size - 5)} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}


const DashboardUser = ({ navigation, OrderId }) => {

    // const [OrderId, setOrderId] = useState("");

    const [user, setUser] = useState({ loggedIn: false });

    const [loading, setloading] = useState(false);

    useEffect(() => {
        try {
            // setloading(true)
            const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
            navigation.setOptions({
                headerShown: true,
                title: "Dashboard User",
                headerRight: () => (
                    <AntDesign name="logout" size={24} color="black" onPress={() => signOut(auth).then(() => {
                        setloading(false)
                        Alert.alert(`${phoneNumber}`, 'you have successfully logged out!');
                        navigation.replace('Main')
                    }).catch((error) => {
                        setloading(false)
                        Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                    })} />
                ),
                headerLeft: () => <></>
            })
        }
        catch (error) {
            // setloading(false)
            setUser({ loggedIn: false })
        }
    }, [user])


    useEffect(() => {
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

    return (

        <SafeAreaView style={styles.mainBody}>
            <ActivityIndicatorElement loading={loading} />
            <NavigationContainer independent={true}>
                <MyTabs navigation={navigation} OrderId={OrderId} />
            </NavigationContainer>
        </SafeAreaView>
    );
};
export default DashboardUser;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        bottom: '0.15%',
        justifyContent: "center",
        backgroundColor: "#307ecc",
        alignContent: "center",
    },
});