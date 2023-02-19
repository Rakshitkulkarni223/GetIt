import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";

import { FontAwesome5,MaterialIcons, MaterialCommunityIcons  } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale} from './Dimensions';
import ActivityIndicatorElement from "./ActivityIndicatorElement";

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
                        flex: 0.1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderWidth: scale(0.5),
                        borderColor: '#000'
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <FontAwesome5 name="user" size={verticalScale(14)} color="#000" />
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
                            onPress={()=>{
                                navigation.navigate('User Profile',{
                                    displayCurrentAddress : displayCurrentAddress,
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
                        borderWidth: scale(0.5),
                        borderColor: '#000'
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <MaterialCommunityIcons name="information-outline" size={verticalScale(16)} color="#000" />
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
                            >About us</Text>
                        </View>
                    </View>
                    <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderColor: '#000',
                        borderWidth: scale(0.5),
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <MaterialIcons name="contact-support" size={verticalScale(16)} color="#000" />
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
                            >Contact us</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
    )
}

export default UserAccountDetails
