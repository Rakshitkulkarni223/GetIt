import React, { useState, createRef } from "react";
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

import { signInWithEmailAndPassword } from 'firebase/auth';

import { admins, app, auth, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";


const Login = ({ navigation }) => {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errortext, setErrortext] = useState("");

    const passwordInputRef = createRef();

    const handleSubmitPress = async () => {
        setErrortext("");
        if (!userEmail) {
            alert("Please fill Email");
            return;
        }
        if (!userPassword) {
            alert("Please fill Password");
            return;
        }

        await signInWithEmailAndPassword(auth, userEmail, userPassword)
            .then((user) => {
                // console.log(user);
                // If server response message same as Data Matched
                if (user) {
                    if (admins.includes(userEmail)) {
                        navigation.replace("Dashboard Admin");
                    }
                    else {
                        navigation.replace("Home");
                    }
                }
            })
            .catch((error) => {
                // console.log(error);
                if (error.code === "auth/invalid-email")
                    setErrortext(error.message);
                else if (error.code === "auth/user-not-found")
                    setErrortext("No User Found");
                else {
                    setErrortext(
                        "Please check your email id or password"
                    );
                }
            });
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
                                onChangeText={(UserEmail) =>
                                    setUserEmail(UserEmail)
                                }
                                placeholder="Enter Email"
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
                                onChangeText={(UserPassword) =>
                                    setUserPassword(UserPassword)
                                }
                                placeholder="Enter Password"
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                secureTextEntry={true}
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
                                LOGIN
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.registerTextStyle}
                            onPress={() =>
                                navigation.replace("Signup")
                            }
                        >
                            New User? Register
                        </Text>

                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default Login;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#307ecc",
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
        color: "white",
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