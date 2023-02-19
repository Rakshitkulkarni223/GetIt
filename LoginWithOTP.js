import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  // TouchableOpacity,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { admins, app, auth, database, firebaseConfig } from "./Firebase";
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, child, get, onValue, set } from "firebase/database";


import * as Notifications from 'expo-notifications';


import { scale, moderateScale, verticalScale } from './Dimensions';

import FlashMessage, { showMessage } from 'react-native-flash-message';

import { normalize } from './FontResize';
import ActivityIndicatorElement from './ActivityIndicatorElement';

import { AntDesign, Feather, MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationPermission } from './NotificationHandler';


const LoginWithOTP = ({ navigation }) => {
  // Ref or state management hooks
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState();

  const [message, setMessage] = useState();
  const attemptInvisibleVerification = false;

  const [loading, setloading] = useState(false);

  const flashMessage = useRef();


  useEffect(() => {
    setloading(false)
    navigation.setOptions({
      title: !verificationId ? "Login" : "",
      headerLeft: () => (
        verificationId ? <Ionicons name="chevron-back-sharp" size={normalize(20)} color="black" onPress={() => {
          setVerificationId()
          setVerificationCode()
          setPhoneNumber()
        }} /> : <></>
      )
    })
  }, [verificationId])



  const displayFlashMessage = () => {
    var msg = message.text;
    var type = message.type;

    var color = ''

    var backgroundColor = '#8BB7BB'

    if (type === 'info') {
      color = '#fff';
      backgroundColor = "#4A5295"
    }

    if (type === 'danger') {
      color = 'red'
    }

    flashMessage.current.showMessage({
      message: msg,
      type: type,
      animationDuration: 650,
      duration: 5000,
      position: 'top',
      icon: () => (
        <View style={{
          alignItems: 'center',
          paddingRight: scale(6),
        }}>
          {type === 'danger' ? <MaterialIcons name="error-outline" size={normalize(18)} color="black" /> :
            <FontAwesome5 name="check-circle" size={normalize(18)} color="#00A24A" />}
        </View>
      ),
      style: [styles.flashMessage, { backgroundColor: backgroundColor }],
      titleStyle: [styles.flashText, { color: color }],
    })

    setMessage('');
  }

  const [selectMode, setselectMode] = useState(false);

  const [adminPhoneNumber, setadminPhoneNumber] = useState('');

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column'
      }}>
        {/* <KeyboardAvoidingView enabled> */}
        {verificationId ? <ScrollView>
          <ActivityIndicatorElement loading={loading} />
          <FlashMessage ref={flashMessage} />

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: verticalScale(15),
          }}>
            <View style={[styles.progressBar, { backgroundColor: '#69D9B9' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
            <View style={[styles.progressBar, { backgroundColor: (verificationId) ? '#69D9B9' : '#fff' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
            <View style={[styles.progressBar, { backgroundColor: '#fff' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
          </View>

          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: verticalScale(50),
                borderWidth: scale(0.5),
                borderColor: '#909191',
                backgroundColor: "#C6C7C7",
                borderRadius: scale(100),
                padding: scale(30)
              }}>
                <MaterialCommunityIcons name="message-badge" size={normalize(50)} color="#39516F" />
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: verticalScale(40),
            }}>
              <Text style={{
                fontSize: normalize(18),
                color: '#5B5B5B',
                fontWeight: '600',
                letterSpacing: scale(0.5),
              }}>
                Verification

              </Text>
            </View>


            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: verticalScale(20),
            }}>
              <Text style={{
                fontSize: normalize(15),
                color: '#000',
                paddingHorizontal: scale(30),
                textAlign: 'center',
                letterSpacing: scale(0.5)
              }}>


                <Text>Enter 6 digits verification code sent to your number</Text>
                <Text style={{ fontWeight: '600' }}> +91 {phoneNumber}</Text>


              </Text>
            </View>

            <View
              style={{
                padding: scale(20),
                //  marginTop: 50 
              }}
            >
              <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
              />


              <View style={{
                marginBottom: scale(15),
                marginTop: scale(10),
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: scale(20),
                marginTop: scale(45),
              }}>
                <View>
                  <TextInput
                    style={{ fontSize: normalize(24) }}
                    editable={!!verificationId}
                    cursorColor='#778899'
                    placeholder="- - - - - -"
                    autoCompleteType="tel"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    onChangeText={setVerificationCode}
                  />
                </View>

              </View>

              {message ?
                displayFlashMessage(message.text, message.type)
                : undefined}

              <Modal visible={selectMode} transparent={true}>

                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>

                  <View style={{
                    // flex: 0.5,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#656F95',
                    borderWidth: scale(1),
                    borderColor: '#33A086',
                    borderRadius: scale(8),
                    marginHorizontal: scale(20),
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginLeft: scale(30),
                    }}>
                      <AntDesign name="close" size={normalize(18)} color="#fff"
                        onPress={() => {
                          setselectMode(false)
                        }}
                      />
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginVertical: verticalScale(20)
                    }}>
                      <MaterialIcons name="verified-user" size={normalize(40)} color="#3CCA7E" />
                    </View>

                    <View style={{
                      padding: scale(3),
                      // borderRightWidth: scale(1),
                      marginVertical: verticalScale(20),
                      justifyContent: 'center'
                    }}>
                      <Text style={{
                        fontSize: normalize(16),
                        textAlignVertical: 'center',
                        padding: scale(10),
                        color: '#fff',
                        letterSpacing: scale(0.2)
                      }}
                      >Please enter your mobile number to become an admin</Text>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: scale(10),
                      borderWidth: scale(1),
                      borderColor: "#000",
                      marginVertical: verticalScale(20)
                    }}>
                      <View style={{
                        padding: scale(4),
                        borderRightWidth: scale(1),
                        justifyContent: 'center',
                        backgroundColor: "#87858E",
                        // padding: scale(2)
                      }}>
                        <Text style={{
                          fontSize: normalize(16),
                          padding: scale(0),
                          textAlignVertical: 'center',
                          color: '#fff'
                        }}>+91</Text>
                      </View>
                      <View style={{
                        justifyContent: 'flex-start',
                        marginHorizontal: scale(5),
                        width: '65%',
                        flexDirection: 'row',
                      }}>
                        <TextInput
                          style={{ fontSize: normalize(16), color: '#fff', fontWeight: '300' }}
                          placeholder="Enter Mobile Number"
                          cursorColor='#fff'
                          placeholderTextColor="#fff"
                          autoCompleteType="tel"
                          letterSpacing={normalize(1.8)}
                          keyboardType="phone-pad"
                          textContentType="telephoneNumber"
                          onChangeText={setadminPhoneNumber}
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </View>

                    </View>

                    <View style={{
                      marginHorizontal: scale(5),
                      marginVertical: verticalScale(10)
                    }}>
                      <TouchableOpacity style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: verticalScale(8),
                        paddingHorizontal: scale(30),
                        borderRadius: scale(4),
                        elevation: scale(5),
                        backgroundColor: 'black',
                        marginVertical: verticalScale(5),
                        borderColor: '#fff',
                        marginHorizontal: scale(3),
                        borderWidth: scale(0.5)
                      }}
                        onPress={async () => {
                          if (!adminPhoneNumber || adminPhoneNumber.length !== 10) {
                            setMessage({ text: `Error: Invalid Mobile Number!!`, type: 'danger' });
                          }
                          else {
                            try {

                              await NotificationPermission()
                              var token = (await Notifications.getExpoPushTokenAsync()).data;
                              await set(ref(database, `adminList/` + '+91' + adminPhoneNumber), {
                                fcmToken: token,
                              })
                              Alert.alert("Login as Admin", 'Please login with your registered admin mobile number.')
                              navigation.reset({
                                index: 0,
                                routes: [{ name: "LoginWithOTP" }],
                              });
                            }
                            catch (error) {
                              console.log(error)
                            }

                          }
                        }}
                      >
                        <Text style={{
                          letterSpacing: scale(0.4),
                          fontSize: normalize(15),
                          color: '#fff',
                          fontWeight: '600'
                        }}>MAKE ADMIN</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>

              </Modal>


              <View>
                <TouchableOpacity style={[styles.button, { marginTop: verticalScale(15) }]}
                  onPress={async () => {
                    setloading(true)
                    try {
                      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                      await signInWithCredential(auth, credential);

                      if (admins.includes('+91' + phoneNumber)) {
                        setloading(false)
                        setselectMode(true)
                      }
                      else {
                        setloading(false)
                        await NotificationPermission()
                        var token = (await Notifications.getExpoPushTokenAsync()).data;
                        await set(ref(database, `usersList/` + '+91' + phoneNumber), {
                          fcmToken: token,
                        })
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "Home" }],
                        });
                      }
                    } catch (err) {
                      setloading(false)
                      await NotificationPermission()
                      var token = (await Notifications.getExpoPushTokenAsync()).data;
                      await set(ref(database, `usersList/` + '+91' + phoneNumber), {
                        fcmToken: token,
                      })
                      setMessage({ text: `Error: ${err.message}`, type: 'danger' });
                    }
                  }}
                >
                  <Text style={styles.text}>VERIFY</Text>
                </TouchableOpacity>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: verticalScale(30),
                }}>
                  <View>
                    <Text style={{
                      fontSize: normalize(13),
                      color: '#000',
                      paddingHorizontal: scale(5),
                      textAlign: 'center',
                      letterSpacing: scale(0.5)
                    }}>
                      Didn't Receive OTP?
                    </Text>
                  </View>
                  <View style={{
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      textAlign: 'center',
                      fontSize: normalize(14),
                      fontWeight: '600',
                      color: '#753D8C',
                      paddingHorizontal: scale(5),
                      textAlign: 'center',
                      letterSpacing: scale(0.5),
                    }} onPress={async () => {
                      try {
                        if (!phoneNumber || phoneNumber.length !== 10) {
                          setMessage({ text: `Error: Invalid Mobile Number!!`, type: 'danger' });
                        }
                        else {
                          const phoneProvider = new PhoneAuthProvider(auth);
                          const verificationId = await phoneProvider.verifyPhoneNumber(
                            '+91' + phoneNumber,
                            recaptchaVerifier.current
                          );
                          setVerificationId(verificationId);
                          // setMessage({ text: 'Verification code has been sent to your phone.', type: 'info' });
                        }

                        setloading(false)

                      } catch (err) {
                        setloading(false)
                        setVerificationId();
                        setVerificationCode();
                        setPhoneNumber();
                        setMessage({ text: `Error: ${err.message}`, type: 'danger' });
                      }
                    }}>
                      Resend OTP
                    </Text>
                  </View>
                </View>
              </View>

              {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
            </View>
          </View>
        </ScrollView> :
          <ScrollView>
            <ActivityIndicatorElement loading={loading} />
            <FlashMessage ref={flashMessage} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: verticalScale(15),
            }}>
              <View style={[styles.progressBar, { backgroundColor: '#69D9B9' }]}>
                <Animated.View style={[StyleSheet.absoluteFill]} />
              </View>
              <View style={[styles.progressBar, { backgroundColor: (verificationId) ? '#69D9B9' : '#fff' }]}>
                <Animated.View style={[StyleSheet.absoluteFill]} />
              </View>
              <View style={[styles.progressBar, { backgroundColor: '#fff' }]}>
                <Animated.View style={[StyleSheet.absoluteFill]} />
              </View>
            </View>

            <View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: verticalScale(50),
                  borderWidth: scale(0.5),
                  backgroundColor: '#6CA589',
                  borderRadius: scale(100),
                  padding: scale(30)
                }}>

                  <AntDesign name="mobile1" size={normalize(50)} color="#39516F" />
                </View>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: verticalScale(40),
              }}>
                <Text style={{
                  fontSize: normalize(18),
                  color: '#5B5B5B',
                  fontWeight: '600',
                  letterSpacing: scale(0.5),
                }}>
                  Login With Mobile Number
                </Text>
              </View>


              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: verticalScale(20),
              }}>
                <Text style={{
                  fontSize: normalize(15),
                  color: '#000',
                  paddingHorizontal: scale(30),
                  textAlign: 'center',
                  letterSpacing: scale(0.5)
                }}>

                  <Text>We will send you a </Text>
                  <Text style={{ fontWeight: '600' }}>One Time Passoword </Text>
                  <Text>on your mobile number</Text>

                </Text>
              </View>

              <View
                style={{
                  padding: scale(20),
                  //  marginTop: 50 
                }}
              >
                <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={firebaseConfig}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginBottom: scale(20),
                    marginTop: scale(50),
                    // marginLeft: '2%',
                    borderWidth: scale(1),
                    borderRadius: 3,
                    borderColor: '#808080'
                  }}
                >
                  <View style={{
                    // borderWidth: 1,
                    padding: scale(5),
                    paddingRight: scale(6),
                    justifyContent: 'center',
                    backgroundColor: '#d3d3d3'
                  }}>
                    <Text style={{ fontSize: normalize(17), textAlignVertical: 'center', color: '#808080' }}>+91</Text>
                  </View>

                  <View style={{
                    // flex: 1,
                    width: '65%',
                    flexDirection: 'row',
                    marginLeft: scale(5),
                    // justifyContent: 'center'
                  }}>
                    <TextInput
                      style={{ fontSize: normalize(17), padding: scale(2) }}
                      placeholder="Enter Mobile Number"
                      cursorColor='#778899'
                      autoCompleteType="tel"
                      letterSpacing={normalize(1.8)}
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                      onChangeText={setPhoneNumber}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>

                  <View style={{
                    // flex: 1,
                    marginLeft: scale(35),
                    justifyContent: 'center',
                  }}>
                    {phoneNumber && phoneNumber.length === 10 ? <Feather name="check-circle" size={normalize(18)} color="#249A5A" /> : <></>}
                  </View>

                </View>



                <TouchableOpacity style={[styles.button, { marginTop: verticalScale(15) }]}
                  onPress={async () => {
                    setloading(true)
                    try {
                      if (!phoneNumber || phoneNumber.length !== 10) {
                        setloading(false)
                        setMessage({ text: `Error: Invalid Mobile Number!! Please Enter 10 digit mobile number.`, type: 'danger' });
                        return;
                      }
                      else {
                        if (!phoneNumber.match(/^\d{10}$/)) {
                          setloading(false)
                          setMessage({ text: `Error: Invalid Mobile Number!! Please enter only digits.`, type: 'danger' });
                          return;
                        }
                        const phoneProvider = new PhoneAuthProvider(auth);
                        const verificationId = await phoneProvider.verifyPhoneNumber(
                          '+91' + phoneNumber,
                          recaptchaVerifier.current
                        );
                        setVerificationId(verificationId);
                        // setMessage({ text: 'Verification code has been sent to your phone.', type: 'info' });
                        setloading(false)
                        // navigation.navigate('Verification', {verificationId: verificationId, phoneNumber: phoneNumber})
                      }
                    } catch (err) {
                      setloading(false)
                      setMessage({ text: `Error: ${err.message}`, type: 'danger' });
                    }
                  }}
                >

                  <Text style={styles.text}>GET OTP</Text>
                </TouchableOpacity>
                {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
              </View>
            </View>
          </ScrollView>
        }
        {message ?
          displayFlashMessage()
          : undefined}
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </>
  );
}

export default LoginWithOTP;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(30),
    borderRadius: scale(4),
    elevation: scale(5),
    backgroundColor: 'black',
  },
  progressBar: {
    height: verticalScale(7),
    width: scale(80),
    marginLeft: scale(10),
    // backgroundColor: '#738AD2',
    borderColor: '#000',
    borderWidth: scale(0.8),
    borderRadius: scale(5)
  },
  flashMessage: {
    borderRadius: scale(0),
    opacity: 0.8,
    alignItems: 'center',
    borderWidth: scale(0),
    borderColor: '#222',
    margin: scale(0)
  },
  flashText: {
    fontSize: normalize(13),
    fontWeight: '600'
  },
  text: {
    fontSize: normalize(15),
    lineHeight: scale(18),
    fontWeight: '600',
    letterSpacing: scale(2),
    color: 'white',
  },
});


