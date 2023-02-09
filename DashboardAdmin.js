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



const Tab = createBottomTabNavigator();

function MyTabs() {

    return (
        <Tab.Navigator
            initialRouteName="View Items"
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
                    tabBarIcon: ({ color, size }) => (
                        <Octicons name="diff-added" color={color} size={size - 3} />
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

    const [loading, setloading] = useState(false);

    useEffect(() => {
        try {
            const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
            navigation.setOptions({
                headerShown: true,
                title: 'Dashboard Admin',
                headerRight: () => (
                    <AntDesign name="logout" size={normalize(20)} color="black" onPress={() => signOut(auth).then(() => {
                        Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        });
                    }).catch((error) => {
                        Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                    })} />
                ),
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