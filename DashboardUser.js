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


const DashboardUser = ({ navigation, route }) => {

    const [user, setUser] = useState({ loggedIn: false });

    const [textbutton, setTextButton] = useState("");

    useEffect(() => {

        if (textbutton === "Logout") {
            const email = auth.currentUser.email;
            navigation.setOptions({
                headerRight: () => (
                    <AntDesign name="logout" size={24} color="black" onPress={() => signOut(auth).then(() => {
                        alert(`${email}, you have successfully logged out!`);
                        navigation.navigate("Home")
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
            <ViewItems navigation={navigation} OrderId={route.params.OrderId}/>
        </SafeAreaView>
    );
};
export default DashboardUser;

const styles = StyleSheet.create({
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
    mainBody: {
        flex: 1,
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