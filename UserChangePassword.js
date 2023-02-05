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
} from "react-native";

import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"


import { admins, app, auth, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';

import { normalize } from "./FontResize";

const UserChangePassword = ({ navigation }) => {
    const [NewPassword, setNewPassword] = useState("");
    const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, showMessage] = useState("");

    const [currentPassword, setcurrentPassword] = useState('');

    const [email, setemail] = useState('');

    useEffect(() => {
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
    }, [])

    const handleSubmitPress = async () => {
        showMessage("");
        if (!NewPassword) {
            alert("Please fill Email");
            return;
        }
        if (!ConfirmNewPassword) {
            alert("Please fill Password");
            return;
        }

        if (NewPassword !== ConfirmNewPassword) {
            showMessage('Passwords Do Not Matched!!');
            return;
        }

        try {
            alert("Password Updated!");
            update(ref(database, `users/${auth.currentUser.phoneNumber}/`), {
                password: NewPassword
            })
            navigation.navigate('User Profile')
        }
        catch (error) {
            alert(error)
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
            <View style={{ padding: scale(18), marginTop: verticalScale(20) }}>
                <View
                    style={{
                        borderWidth: scale(0.5),
                        borderRadius: scale(5),
                        marginTop: verticalScale(10),
                    }}
                >
                    <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}
                    >New password</Text>
                    <TextInput
                        style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                        placeholder="Enter new password"
                        autoFocus
                        keyboardType="default"
                        onChangeText={(NewPassword) => {
                            setNewPassword(NewPassword)
                        }}
                    />

                </View>
                <View style={{
                    //   borderTopWidth: scale(0.5)
                    borderWidth: scale(0.5),
                    borderRadius: scale(5),
                    marginTop: verticalScale(10),
                }}>
                    <Text style={{
                        marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
                    }}>Confirm password</Text>
                    <TextInput
                        style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                        placeholder="Confirm password"
                        keyboardType="default"
                        onChangeText={(ConfirmNewPassword) => {
                            setConfirmNewPassword(ConfirmNewPassword)
                        }}
                    />
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
                    marginTop: verticalScale(20),
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