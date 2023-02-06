import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, ImageBackground, View, StyleSheet, Button, Alert, SafeAreaView, ScrollView, Modal, ActivityIndicator } from 'react-native';

import { onAuthStateChanged, signOut } from "firebase/auth";

import { app, auth, db, database, admins } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";
import { AntDesign } from '@expo/vector-icons';

import uuid from 'react-native-uuid';
import DashboardUser from './DashboardUser';
import DashboardAdmin from './DashboardAdmin';
import LoginWithOTP from './LoginWithOTP';
import ActivityIndicatorElement from './ActivityIndicatorElement';

const Home = ({ navigation }) => {

    const image = { uri: 'https://reactjs.org/logo-og.png' };

    const [user, setUser] = useState({ loggedIn: false });

    const [OrderId, setOrderId] = useState("");

    const [loading, setloading] = useState(false);

    useEffect(() => {

        setloading(true);

        const unsubscribe = onAuthStateChanged(auth, (validuser) => {
            if (validuser) {
                const uid = validuser.uid;
                setOrderId(uuid.v4().substring(0, 8));
                setUser({ loggedIn: true, phoneNumber: validuser.phoneNumber })
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
                    (admins.includes(user.phoneNumber)) ?
                        <DashboardAdmin navigation={navigation}></DashboardAdmin> :
                        <DashboardUser navigation={navigation} OrderId={OrderId}></DashboardUser>
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