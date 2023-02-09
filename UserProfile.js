import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text, Image, Pressable } from "react-native";

import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';
import { normalize } from "./FontResize";
import ActivityIndicatorElement from "./ActivityIndicatorElement";

const UserProfile = ({ navigation }) => {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [password, setpassword] = useState('');
    const [DOB, setDOB] = useState('');
    const [email, setemail] = useState('');
    const [ProfilePic, setProfilePic] = useState('');

    const [loading, setloading] = useState(false);

    useEffect(() => {
        setloading(true)
        onValue(ref(database, `users/${auth.currentUser.phoneNumber}/`), (snapshot) => {
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
                style={{ flex: 1, backgroundColor: '#3B3636' }}
            >
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
                            marginBottom: scale(5),
                            marginLeft: scale(60),
                        }}
                    >
                        {ProfilePic ?

                            <Image
                                style={{
                                    width: scale(170),
                                    height: verticalScale(160),
                                    borderRadius: scale(100),
                                    borderWidth: scale(1),
                                    borderColor: '#3F999E',
                                    resizeMode: 'cover'
                                }}
                                source={{
                                    uri: ProfilePic ? ProfilePic : ''
                                }}
                                onLoadStart={() => {setloading(true)}}
                                onLoadEnd={() => {setloading(false)}}
                            />
                            :
                            <Image
                                style={{
                                    width: scale(170),
                                    height: verticalScale(160),
                                    borderRadius: scale(100),
                                    borderWidth: scale(1),
                                    borderColor: '#3F999E',
                                    resizeMode: 'cover'
                                }}

                                source={require('./assets/Profile.png')}

                                onLoadStart={()=>setloading(true)}
                                onLoadEnd={()=>{
                                  setloading(false)
                                }}
                            // source={{
                            //   uri: ProfilePic ? ProfilePic : 'Images:/Profile.png'
                            //   // '/assets/Profile.jpg'
                            //   // 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
                            //   // 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
                            // }}
                            />
                        }

                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: scale(5),
                            borderBottomWidth: scale(0.5),
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                >Legal name</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(15),
                                        fontFamily: 'sans-serif-light',
                                        color: 'white'
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
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                >Date of birth</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(15),
                                        fontFamily: 'sans-serif-light',
                                        color: 'white'
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
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                >Phone Number</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(15),
                                        fontFamily: 'sans-serif-light',
                                        color: 'white'
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
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                >Email</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(15),
                                        fontFamily: 'sans-serif-light',
                                        color: 'white'
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
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                >Password</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: normalize(15),
                                        fontFamily: 'sans-serif-light',
                                        color: 'white'
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
                            borderColor: 'white'
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
                                        color: 'white'
                                    }}
                                    onPress={() => {
                                        navigation.navigate('Change Password')
                                    }}
                                >Change Password</Text>
                            </View>
                            <View>
                                <AntDesign name="right" size={normalize(16)} color="white"
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
                            paddingVertical: verticalScale(5),
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
                                    params: { firstName: firstName, lastName: lastName, DOB: DOB, email: email, password: password , ProfilePic: ProfilePic}
                                }
                                ],
                            });
                        }}>
                            <Text style={{
                                fontSize: normalize(16),
                                lineHeight: verticalScale(20),
                                fontWeight: '600',
                                letterSpacing: scale(0.5),
                                color: 'white',
                            }}>Update Profile</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default UserProfile;
