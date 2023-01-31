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

import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import PendingOrders from "./users/PendingOrders";
import ConfiremdOrders from "./users/ConfiremdOrders";
import ViewItems from "./users/ViewItems";

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";
import UsersCompletedOrders from "./users/UsersCompletedOrders";



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
                        <MaterialIcons name="preview" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Your Orders"
                children={() => <UsersCompletedOrders navigation={navigation} OrderId={OrderId} />}
                options={{
                    tabBarLabel: "Your Orders",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="preview" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}


const DashboardUser = ({ navigation, OrderId }) => {

    const [user, setUser] = useState({ loggedIn: false });

    const [textbutton, setTextButton] = useState("");

    useEffect(() => {

        if (textbutton === "Logout") {
            const email = auth.currentUser.email;
            navigation.setOptions({
                headerRight: () => (
                    <AntDesign name="logout" size={24} color="black" onPress={() => signOut(auth).then(() => {
                        alert(`${email}, you have successfully logged out!`);
                        navigation.replace("Home")
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

        <SafeAreaView style={styles.mainBody}>
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
        bottom: '0.60%',
        justifyContent: "center",
        backgroundColor: "#307ecc",
        alignContent: "center",
    },
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
        marginBottom: 25,
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
    registerTextStyle: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        padding: 10,
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
});