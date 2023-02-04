import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, View, Text, Image } from "react-native";

import { FontAwesome5, MaterialIcons , MaterialCommunityIcons, AntDesign  } from '@expo/vector-icons';

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale} from './Dimensions';

const UserProfile = ({ navigation }) => {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [password, setpassword] = useState('');

    useEffect( () =>{
        onValue(ref(database, `users/${auth.currentUser.phoneNumber}/`), (snapshot) => {
            snapshot.forEach((child) => {
                if(child.key==='firstName')
                {
                    setfirstName(child.val())
                }
                if(child.key==='lastName')
                {
                    setlastName(child.val())
                }
                if(child.key==='password')
                {
                    var dummypassword=''
                    for(let i=0;i<child.val().length;i++)
                    {
                        dummypassword+='*'
                    }
                    setpassword(dummypassword)
                }
            })
        })
    },[])

    return (
        <>
            <SafeAreaView
                style={{ flex: 1, margin: scale(20) }}
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
                            marginBottom: scale(5),
                            marginLeft: scale(60),
                        }}
                    >
                        <Image
                            style={{
                                width: scale(170),
                                height: verticalScale(180),
                                borderRadius: scale(100),
                            }}
                            resizeMode='contain'
                            source={{
                                uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
                            }}
                        />

                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: scale(5),
                            borderBottomWidth: scale(0.5),
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <View style={{marginBottom: scale(3)}}>
                                <Text
                                    style={{
                                        fontSize: moderateScale(15),
                                        fontFamily: 'sans-serif-thin'
                                    }}
                                >Legal name</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: moderateScale(16),
                                        fontFamily: 'sans-serif-light',
                                    }}
                                >{firstName+' '+lastName}</Text>
                            </View>
                        </View>


                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: scale(5),
                            borderBottomWidth: scale(0.5),
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <View style={{marginBottom: scale(3)}}>
                                <Text
                                    style={{
                                        fontSize: moderateScale(15),
                                        fontFamily: 'sans-serif-thin',
                                    }}
                                >{auth.currentUser.email ? 'Email' : 'Phone Number'}</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: moderateScale(16),
                                        fontFamily: 'sans-serif-light',
                                    }}
                                >{auth.currentUser.email ? auth.currentUser.email : auth.currentUser.phoneNumber}</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: scale(5),
                            borderBottomWidth: scale(0.5),
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <View style={{marginBottom: scale(3)}}>
                                <Text
                                    style={{
                                        fontSize: moderateScale(15),
                                        fontFamily: 'sans-serif-thin',
                                    }}
                                >Password</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: moderateScale(16),
                                        fontFamily: 'sans-serif-light',
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
                            borderBottomWidth: scale(0.5),
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{marginBottom: scale(3)}}>
                                <Text
                                    style={{
                                        fontSize: moderateScale(16),
                                        fontFamily: 'sans-serif-light',
                                    }}
                                    onPress={()=>{
                                        navigation.navigate('Change Password')
                                    }}
                                >Change Password</Text>
                            </View>
                            <View>
                                <AntDesign name="right" size={20} color="black" 
                                onPress={()=>{
                                    navigation.navigate('Change Password')
                                }}
                                />
                            </View>
                        </View>


                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default UserProfile;
