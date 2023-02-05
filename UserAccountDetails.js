import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";

import { FontAwesome5,MaterialIcons, MaterialCommunityIcons  } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale} from './Dimensions';

const UserAccountDetails = ({ navigation }) => {

    return (
        <>
            <SafeAreaView
                style={{ flex: 1,margin: scale(25) }}
            >
                <View
                    style={{
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
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <FontAwesome5 name="user" size={verticalScale(18)} color="black" />
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(18),
                                marginLeft: scale(10),
                            }}
                            onPress={()=>{
                                navigation.navigate('User Profile')
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
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <MaterialCommunityIcons name="information-outline" size={verticalScale(18)} color="black" />
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(18),
                                marginLeft: scale(10),
                            }}
                            >About us</Text>
                        </View>
                    </View>
                    <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: scale(10),
                        borderWidth: scale(0.5),
                    }}
                    >
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <MaterialIcons name="contact-support" size={verticalScale(18)} color="black" />
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Text
                            style={{
                                textAlignVertical: 'center',
                                fontSize: verticalScale(18),
                                marginLeft: scale(10),
                            }}
                            >Contact us</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default UserAccountDetails
