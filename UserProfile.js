import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text, Image, Pressable, ScrollView, Dimensions } from "react-native";

import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';
import { normalize } from "./FontResize";
import ActivityIndicatorElement from "./ActivityIndicatorElement";

const UserProfile = ({ navigation, route }) => {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [password, setpassword] = useState('');
    const [DOB, setDOB] = useState('');
    const [email, setemail] = useState('');
    const [ProfilePic, setProfilePic] = useState('https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788');

    const [loading, setloading] = useState(false);

    useEffect(() => {
        setloading(true)
        onValue(ref(database, `users/${auth.currentUser.phoneNumber}/userDetails/`), (snapshot) => {
            snapshot.forEach((child) => {
                if (child.key === 'firstName') {
                    setfirstName(child.val())
                }
                if (child.key === 'lastName') {
                    setlastName(child.val())
                }
                if (child.key === 'email') {
                    setemail(child.val())
                }
                if (child.key === 'Dob') {
                    setDOB(child.val())
                }
                if (child.key === 'ProfilePic') {
                    setProfilePic(child.val())
                }
                if (child.key === 'password') {
                    setpassword(password)
                    var dummypassword = ''
                    for (let i = 0; i < child.val().length; i++) {
                        dummypassword += '*'
                    }
                    setpassword(dummypassword)
                }
            })
        })
        setloading(false)

    }, [])

    return (
        <>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: '#D8E0E7' }}
            >
                <ScrollView>
                    <ActivityIndicatorElement loading={loading} />

                    <View
                        style={{
                            flex: 0.1,
                            margin: scale(20),
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: scale(5),
                            }}
                        >
                            <Image
                                style={{
                                    // width: scale(170),
                                    // height: verticalScale(160),
                                    width: Dimensions.get('window').width * 0.35,
                                    height: Dimensions.get('window').width * 0.35,
                                    // borderRadius: scale(60),
                                    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                    borderWidth: scale(1),
                                    borderColor: '#869BAD',
                                    resizeMode: 'cover'
                                }}
                                source={{
                                    uri: ProfilePic
                                }}
                                onLoadStart={() => { setloading(true) }}
                                onLoadEnd={() => { setloading(false) }}
                            />


                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: 'sans-serif-thin',
                                            color: '#000'
                                        }}
                                    >Legal name</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                    >{firstName + ' ' + lastName}</Text>
                                </View>
                            </View>


                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: 'sans-serif-thin',
                                            color: '#000'
                                        }}
                                    >Date of birth</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                    >{DOB}</Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: 'sans-serif-thin',
                                            color: '#000'
                                        }}
                                    >Phone Number</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                    >{auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3)}</Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: 'sans-serif-thin',
                                            color: '#000'
                                        }}
                                    >Email</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                    >{email}</Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: 'sans-serif-thin',
                                            color: '#000'
                                        }}
                                    >Password</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                    >{password}</Text>
                                </View>
                            </View>


                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                padding: scale(5),
                                paddingTop: verticalScale(7),
                                borderBottomWidth: scale(0.5),
                                borderColor: '#000'
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View style={{ marginBottom: scale(3) }}>
                                    <Text
                                        style={{
                                            fontSize: normalize(15),
                                            fontFamily: 'sans-serif-light',
                                            color: '#000'
                                        }}
                                        onPress={() => {
                                            navigation.navigate('Change Password')
                                        }}
                                    >Change Password</Text>
                                </View>
                                <View>
                                    <AntDesign name="right" size={normalize(16)} color="#000"
                                        onPress={() => {
                                            navigation.navigate('Change Password')
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{
                            marginTop: verticalScale(25),
                        }}>
                            <Pressable style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: verticalScale(7),
                                paddingHorizontal: scale(32),
                                borderRadius: scale(4),
                                elevation: scale(10),
                                borderWidth: scale(1),
                                borderColor: 'black',
                                backgroundColor: '#3EA879',
                            }} onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{
                                        name: 'Signup',
                                        params: { firstName: firstName, lastName: lastName, DOB: DOB, email: email, password: password, ProfilePic: ProfilePic,  displayCurrentAddress : route.params.displayCurrentAddress,
                                            longitude:  route.params.longitude,
                                            latitude:  route.params.latitude }
                                    }
                                    ],
                                });
                            }}>
                                <Text style={{
                                    fontSize: normalize(17),
                                    lineHeight: verticalScale(20),
                                    fontWeight: '600',
                                    letterSpacing: scale(0.5),
                                    color: '#fff',
                                }}>Update Profile</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default UserProfile;
