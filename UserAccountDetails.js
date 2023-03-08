import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text, Alert } from "react-native";

import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Foundation, Ionicons, AntDesign, Feather } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from './Dimensions';
import ActivityIndicatorElement from "./ActivityIndicatorElement";
import { normalize } from "./FontResize";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./Firebase";

const UserAccountDetails = ({ navigation, displayCurrentAddress, longitude, latitude }) => {

    const [loading, setloading] = useState(false);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#D4D7D6' }}
        >
            <ActivityIndicatorElement loading={loading} />
            <View
                style={{
                    margin: scale(25),
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderWidth: scale(0.5),
                    borderColor: '#000'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderBottomWidth: scale(0.5),
                    }}
                >
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <FontAwesome5 name="user" size={verticalScale(14)} color="#000" onPress={() => {
                            navigation.navigate('User Profile', {
                                displayCurrentAddress: displayCurrentAddress,
                                longitude: longitude,
                                latitude: latitude,
                            })
                        }} />
                    </View>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(14),
                                marginLeft: scale(14),
                                color: '#000'
                            }}
                            onPress={() => {
                                navigation.navigate('User Profile', {
                                    displayCurrentAddress: displayCurrentAddress,
                                    longitude: longitude,
                                    latitude: latitude,
                                })
                            }}
                        >My profile</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderBottomWidth: scale(0.5),
                    }}
                >
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <MaterialCommunityIcons name="information-outline" size={verticalScale(16)} color="#000"
                            onPress={() => {
                                navigation.navigate('About Us')
                            }}
                        />
                    </View>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(14),
                                marginLeft: scale(10),
                                color: '#000'
                            }}
                            onPress={() => {
                                navigation.navigate('About Us')
                            }}
                        >About us</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderBottomWidth: scale(0.5),
                    }}
                >
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <MaterialIcons name="contact-support" size={verticalScale(16)} color="#000" onPress={() => {
                            navigation.navigate('Contact Us')
                        }} />
                    </View>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(14),
                                marginLeft: scale(10),
                                color: '#000'
                            }}
                            onPress={() => {
                                navigation.navigate('Contact Us')
                            }}
                        >Contact us</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        // borderBottomWidth: scale(0.5),
                    }}
                >
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Ionicons name="power" size={normalize(17)} color="#BF0505" onPress={async () => {
                            const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
                            await signOut(auth).then(() => {
                                setloading(false)
                                Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
                                navigation.replace('Main')
                            }).catch((error) => {
                                setloading(false)
                                Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                            })
                        }} />
                    </View>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(14),
                                marginLeft: scale(12),
                                color: '#BF0505'
                            }}
                            onPress={async () => {
                                const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
                                await signOut(auth).then(() => {
                                    setloading(false)
                                    Alert.alert(`${phoneNumber}`, 'Logout Successfull!');
                                    navigation.replace('Main')
                                }).catch((error) => {
                                    setloading(false)
                                    Alert.alert(`${phoneNumber}`, 'Logout Unsuccessfull!');
                                })
                            }}
                        >Logout</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default UserAccountDetails
