import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Pressable,
    Modal,
    ActivityIndicator,
    SafeAreaView,
    Animated,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Image,
} from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import { admins, app, auth, db } from "./Firebase";
import { database } from "./Firebase";
import { onValue, ref, set } from "firebase/database";


import * as Notifications from 'expo-notifications';

import { normalize } from './FontResize';

import { AntDesign, EvilIcons, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from './Dimensions';
import ActivityIndicatorElement from './ActivityIndicatorElement';


import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import DashboardAdmin from './DashboardAdmin';
import DashboardUser from './DashboardUser';
import Home from './Home';
import { NotificationHandler, NotificationPermission } from './NotificationHandler';


// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
});


const Main = ({ navigation }) => {

    const [loading, setloading] = useState(false);

    const [user, setUser] = useState({ loggedIn: false });


    useEffect(() => {
        navigation.setOptions({
            title: "",
            headerShown: false
        })
    }, [])

    useEffect(() => {
        try {
            setloading(true)
            const unsubscribe = onAuthStateChanged(auth, (validuser) => {
                if (validuser) {
                    const uid = validuser.uid;
                    setloading(false)
                    setUser({ loggedIn: true, phoneNumber: validuser.phoneNumber })
                } else {
                    setloading(false)
                    setUser({ loggedIn: false })
                }
            });
            return () => {
                unsubscribe();
            }
        }
        catch (error) {
            setloading(false);
            setUser({ loggedIn: false })
        }
    }, [])


    return (
        <>
            {user.loggedIn ? <Home navigation={navigation} />
                :
                <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
                    {/* <ActivityIndicatorElement loading={loading} /> */}
                    <App navigation={navigation} loading={loading} setloading={setloading} user={user} />
                </AnimatedAppLoader>}
        </>
    );
}

function AnimatedAppLoader({ children, image }) {
    const [isSplashReady, setSplashReady] = useState(false);

    useEffect(() => {

        async function prepare() {
            await Asset.fromURI(image.uri).downloadAsync();
        }
        setSplashReady(true);

        prepare();
    }, [image]);

    if (!isSplashReady) {
        return null;
    }

    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }) {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        if (isAppReady) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: true,
            }).start(() => setAnimationComplete(true));
        }
    }, [isAppReady]);

    const onImageLoaded = useCallback(async () => {
        try {
            await SplashScreen.hideAsync();
            // Load stuff
            await Promise.all([]);
        } catch (e) {
            // handle errors
        } finally {
            setAppReady(true);
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {isAppReady && children}
            {!isSplashAnimationComplete && (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: Constants.manifest.splash.backgroundColor,
                            opacity: animation,
                        },
                    ]}
                >
                    <Animated.Image
                        style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: Constants.manifest.splash.resizeMode || "contain",
                            transform: [
                                {
                                    scale: animation,
                                },
                            ],
                        }}
                        source={image}
                        onLoadEnd={onImageLoaded}
                        fadeDuration={0}
                    />
                </Animated.View>
            )}
        </View>
    );
}


const App = ({ navigation, loading, setloading, user }) => {

    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 1000)

    const [placeholder, setPlaceholder] = useState('');

    const string = 'Welcome to GetIt', index = React.useRef(0);
  
    useEffect(() => {
      function tick() {
        setPlaceholder((prev) => prev + string[index.current]);
        index.current++;
      }
      if (index.current < string.length) {
        let addChar = setInterval(tick, 100);
        return () => clearInterval(addChar);
      }
    }, [placeholder]);
  

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#C35C70' }}>
            {/* <ActivityIndicatorElement loading={loading} /> */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: verticalScale(50),
                    // borderWidth: scale(0.8),
                    // backgroundColor: '#797581',
                    // borderRadius: scale(6),
                    // borderColor: '#626365',
                    padding: scale(10)
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        {/* <Ionicons name="md-restaurant-outline" size={normalize(80)} color="#fff" /> */}
                        <Image
                                    source={{ uri: "https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FIcon.png?alt=media&token=c2102a2d-4777-4170-895b-df792be9d172" }}
                                    style={{
                                        marginTop: verticalScale(5),
                                        marginBottom: verticalScale(5),
                                        width: scale(180),
                                        height: verticalScale(160),
                                        resizeMode: 'cover'
                                    }}
                                />
                    </View>
                    {/* <SimpleLineIcons name="basket" size={normalize(45)} color="#69B77F" /> */}
                </View>
            </View>

            <View style={{
                flex: 0.8,
                flexDirection: 'column', justifyContent: 'center',
            }}>
                <View style={{ padding: scale(18), marginTop: verticalScale(5) }}>
                    <Text style={{
                        fontSize: scale(25),
                        // fontWeight: '200',
                        color: '#E5E5E5',
                        letterSpacing: scale(0.25),
                        fontFamily: 'monospace'
                    }}>{placeholder.toUpperCase()}</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginBottom: scale(20),
                        marginTop: scale(50),
                        marginHorizontal: scale(20),
                        borderWidth: scale(1),
                        borderRadius: scale(8),
                        // borderColor: '#808080',
                        backgroundColor: '#535E7F'
                    }}
                >
                    <View style={{
                        padding: scale(0),
                        // paddingRight: scale(10),
                        // paddingRight: scale(2),
                        width: scale(38),
                        borderRightWidth: scale(0.6),
                        borderRadius: scale(6),
                        alignItems: 'center',
                        // justifyContent: 'center',
                        backgroundColor: '#d3d3d3'
                    }}>
                        <FontAwesome name="mobile-phone" size={normalize(28)} color="#3458A0" />
                    </View>

                    <View style={{
                        paddingLeft: scale(5),
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity style={{
                            paddingLeft: scale(20),
                        }} onPress={() => {
                            navigation.replace('LoginWithOTP');
                        }}
                        >
                            <Text style={{
                                fontSize: normalize(14),
                                lineHeight: verticalScale(20),
                                fontWeight: '600',
                                letterSpacing: scale(0.5),
                                color: 'white',
                            }}>
                                {"Login with mobile number".toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}


export default Main;

const styles = StyleSheet.create({
    progressBar: {
        height: verticalScale(7),
        width: scale(80),
        marginLeft: scale(10),
        // backgroundColor: '#738AD2',
        borderColor: '#000',
        borderWidth: scale(0.8),
        borderRadius: scale(5)
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(32),
    },
    text: {
        fontSize: normalize(16),
        lineHeight: verticalScale(20),
        fontWeight: 'bold',
        letterSpacing: scale(0.5),
        color: 'white',
    },
});