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
import { AntDesign, MaterialCommunityIcons,Ionicons,MaterialIcons, Octicons  } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import AddItem from "./admin/AddItem";
import ViewItems from "./admin/ViewItems"
import PendingOrders from "./admin/PendingOrders";
import ConfirmedOrders from "./admin/ConfiremdOrders";



const Tab = createBottomTabNavigator();

function MyTabs() {

    return (
        <Tab.Navigator
            initialRouteName="Add Item"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Add Item"
                component={AddItem}
                options={{
                    tabBarLabel: 'Add Item',
                    tabBarIcon: ({ color , size }) => (  
                        // <Ionicons name="add-circle-sharp" color={color} size={size} />
                        <Octicons name="diff-added" color={color} size={size-3} />
                    ),
                }}
            />
            <Tab.Screen
                name="View Items"
                component={ViewItems}
                options={{
                    tabBarLabel: 'View Items',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="preview" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Pending Orders"
                component={PendingOrders}
                options={{
                    tabBarLabel: 'Pending Orders',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clock-check" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Confiremd Orders"
                component={ConfirmedOrders}
                options={{
                    tabBarLabel: 'Confiremd Orders',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="check-circle" color={color} size={size} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}


const DashboardAdmin = ({ navigation, route }) => {

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
                    <MyTabs />
                </NavigationContainer>
        </SafeAreaView>
    );
};
export default DashboardAdmin;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        bottom: '0.1%',
    },
});