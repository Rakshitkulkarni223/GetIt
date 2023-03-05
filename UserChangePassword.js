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
    Icon,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    Pressable,
    Alert,
} from "react-native";

import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"


import { admins, app, auth, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';

import { normalize } from "./FontResize";
import ActivityIndicatorElement from "./ActivityIndicatorElement";
import { Ionicons } from "@expo/vector-icons";

const UserChangePassword = ({ navigation }) => {
    const [NewPassword, setNewPassword] = useState("");
    const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, showMessage] = useState("");

    const [showNewPassword, setshowNewPassword] = useState(false);
    const [showConfirmNewPassword, setshowConfirmNewPassword] = useState(false);

    const [currentPassword, setcurrentPassword] = useState('');

    const [email, setemail] = useState('');

    const [loading, setloading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontSize: normalize(16),
                fontWeight: '500',
                color: '#fff'
            },
            headerStyle: {
                backgroundColor: '#77C98D',
                backgroundColor: '#718A8E',
            }
        })
    }, [])

    useEffect(() => {

        setloading(true)

        onValue(ref(database, `users/${auth.currentUser.phoneNumber}/`), (snapshot) => {
            snapshot.forEach((child) => {
                if (child.key === 'password') {
                    setcurrentPassword(child.val())
                }
                if (child.key === 'email') {
                    setemail(child.val())
                }
            })
        })

        setloading(false)

    }, [])

    const handleSubmitPress = async () => {
        

        showMessage("");

        if (!NewPassword) {
            Alert.alert("New Password","Please enter your new password!");
            return;
        }
        if (!ConfirmNewPassword) {
            Alert.alert("Confirm Password","Please confirm your password!");
            return;
        }

        if (NewPassword !== ConfirmNewPassword) {
            showMessage('Passwords Do Not Matched!!');
            return;
        }

        try {
            setloading(false)
            Alert.alert("Password Updated!");
            setloading(true)
            update(ref(database, `users/${auth.currentUser.phoneNumber}/userDetails/`), {
                password: NewPassword
            })
            setloading(false)
            navigation.navigate('User Profile')
        }
        catch (error) {
            setloading(false)
            Alert.alert(error)
            showMessage("Password not updated.")
        }

        // const credential = EmailAuthProvider.credential(email, currentPassword)
        // await reauthenticateWithCredential(auth.currentUser, credential)
        //     .then(() => {
        //         updatePassword(auth.currentUser, NewPassword).then(() => {
        //             alert("Password Updated!");
        //             update(ref(database, `users/${auth.currentUser.phoneNumber}/`), {
        //                 password: NewPassword
        //             })
        //             navigation.navigate('User Profile')
        //         }).catch((error) => {
        //             alert(error)
        //             setErrortext("Password not updated.")
        //         });
        //     }).catch((error) => {
        //         alert(error)
        //         setErrortext("Password not updated.")
        //     });
    };

    return (

        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicatorElement loading={loading} />
            <View style={{
                padding: scale(18),
                marginTop: verticalScale(20),
                // flex: 1, 
            }}>
                <View
                    style={{
                        borderWidth: scale(0.5),
                        borderRadius: scale(5),
                        marginTop: verticalScale(10),
                    }}
                >
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                    }}>
                        <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}
                        >New password</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: scale(10), marginBottom: verticalScale(5),
                        }}>
                            <View style={{
                                width: '85%',
                                justifyContent: 'center'
                            }}>

                                <TextInput
                                    style={{ fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                                    placeholder="Enter new password"
                                    autoFocus
                                    secureTextEntry={!showNewPassword}
                                    cursorColor="#A7A7A7"
                                    keyboardType="default"
                                    onChangeText={(NewPassword) => {
                                        showMessage("")
                                        setNewPassword(NewPassword)
                                    }}
                                />
                            </View>
                            <View style={{
                                justifyContent: 'center'
                            }}>
                                <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={normalize(16)} color={showNewPassword ? "#14B26D" : "#D80A20"} onPress={() => {
                                    setshowNewPassword(!showNewPassword);
                                }} />
                            </View>
                        </View>

                    </View>


                </View>
                <View style={{
                    borderWidth: scale(0.5),
                    borderRadius: scale(5),
                    marginTop: verticalScale(10),
                }}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                    }}>
                        <Text style={{
                            marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
                        }}>Confirm password</Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: scale(10), marginBottom: verticalScale(5),
                        }}>
                            <View style={{
                                width: '85%',
                                justifyContent: 'center'
                            }}>
                                <TextInput
                                    style={{ fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                                    placeholder="Confirm password"
                                    keyboardType="default"
                                    secureTextEntry={!showConfirmNewPassword}
                                    cursorColor="#A7A7A7"
                                    onChangeText={(ConfirmNewPassword) => {
                                        showMessage("")
                                        setConfirmNewPassword(ConfirmNewPassword)
                                    }}
                                />

                            </View>
                            <View style={{
                                justifyContent: 'center'
                            }}>
                                <Ionicons name={showConfirmNewPassword ? "eye-outline" : "eye-off-outline"} size={normalize(16)} color={showConfirmNewPassword ? "#14B26D" : "#D80A20"} onPress={() => {
                                    setshowConfirmNewPassword(!showConfirmNewPassword);
                                }} />
                            </View>


                        </View>
                        </View>


                    </View>
                    {message ? (
                        <Text
                            style={{
                                color: 'red',
                                fontSize: normalize(16),
                                textAlign: 'center',
                                marginTop: scale(20),
                            }}>
                            {message}
                        </Text>
                    ) : undefined}
                    <View style={{
                        marginTop: verticalScale(30),
                    }}>
                        <Pressable style={styles.button} onPress={handleSubmitPress}>
                            <Text style={styles.text}>Change Password</Text>
                        </Pressable>
                    </View>
                </View>
        </SafeAreaView>
    );
};
export default UserChangePassword;


const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(32),
        borderRadius: scale(4),
        elevation: scale(10),
        backgroundColor: 'black',
    },
    text: {
        fontSize: normalize(16),
        lineHeight: verticalScale(20),
        fontWeight: '600',
        letterSpacing: scale(0.5),
        color: 'white',
    },
});