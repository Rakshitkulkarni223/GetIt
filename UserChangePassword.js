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
} from "react-native";

import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"


import { admins, app, auth, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";


const UserChangePassword = ({ navigation }) => {
    const [NewPassword, setNewPassword] = useState("");
    const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
    const [errortext, setErrortext] = useState("");

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

    const passwordInputRef = createRef();

    const handleSubmitPress = async () => {
        setErrortext("");
        if (!NewPassword) {
            alert("Please fill Email");
            return;
        }
        if (!ConfirmNewPassword) {
            alert("Please fill Password");
            return;
        }

        if (NewPassword !== ConfirmNewPassword) {
            setErrortext('Passwords Do Not Matched!!');
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
            setErrortext("Password not updated.")
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
        <SafeAreaView style={styles.mainBody}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                <View>
                    <KeyboardAvoidingView enabled>
                        <View style={{ alignItems: "center" }}>
                        </View>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(NewPassword) =>
                                    setNewPassword(NewPassword)
                                }
                                placeholder="New Password"
                                placeholderTextColor="#8b9cb5"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordInputRef.current &&
                                    passwordInputRef.current.focus()
                                }
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ConfirmNewPassword) =>
                                    setConfirmNewPassword(ConfirmNewPassword)
                                }
                                placeholder="Confirm Password"
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
                            />
                        </View>
                        {errortext != "" ? (
                            <Text style={styles.errorTextStyle}>
                                {" "}
                                {errortext}{" "}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitPress}
                        >
                            <Text style={styles.buttonTextStyle}>
                                Update Password
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default UserChangePassword;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        alignContent: "center",
    },
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
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: "black",
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "#dadae8",
    },
    registerTextStyle: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        padding: 10,
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
});
