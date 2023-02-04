import * as React from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { admins, app, auth, database, firebaseConfig } from "./Firebase";
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, child, get, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';

const LoginWithOTP = ({ navigation }) => {
  // Ref or state management hooks
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();

  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
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
        <Text style={{
          // marginTop: 20, 
          fontSize: moderateScale(15),
        }}>Enter Phone Number</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: scale(20),
            marginTop: scale(10),
            // marginLeft: '2%',
            borderWidth: scale(1),
            borderRadius: 3,
            borderColor: '#808080'
          }}
        >
          <View style={{
            // borderWidth: 1,
            padding: scale(3),
            paddingRight: scale(6),
            justifyContent: 'center',
            backgroundColor: '#d3d3d3'
          }}>
            <Text style={{ fontSize: moderateScale(18, 0.4), color: '#808080' }}>+91</Text>
          </View>
          <View style={{
            paddingLeft: scale(3),
          }}>
            <TextInput
              style={{ fontSize: moderateScale(20, 0.1) }}
              placeholder="555-555-4321"
              autoFocus
              cursorColor='#778899'
              autoCompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>


        <Pressable style={styles.button}
          onPress={async () => {
            try {
              if (!phoneNumber || phoneNumber.length !== 10) {
                showMessage({ text: `Error: Invalid Mobile Number!!`, color: 'red' });
              }
              else {
                const phoneProvider = new PhoneAuthProvider(auth);
                const verificationId = await phoneProvider.verifyPhoneNumber(
                  '+91' + phoneNumber,
                  recaptchaVerifier.current
                );
                setVerificationId(verificationId);
                showMessage({
                  text: 'Verification code has been sent to your phone.',
                });
              }
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }}
        >
          <Text style={styles.text}>Send Verification Code</Text>
        </Pressable>
        <Text style={{ marginTop: scale(20), fontSize: moderateScale(15), }}>Enter Verification Code</Text>
        <View style={{
          marginBottom: scale(15),
          marginTop: scale(10),
          alignItems: 'center',
          justifyContent: 'center',

        }}>
          <View>
            <TextInput
              style={{ fontSize: moderateScale(25) }}
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
        <Pressable style={styles.button}
          onPress={async () => {
            try {
              const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
              await signInWithCredential(auth, credential);
              if (admins.includes(phoneNumber)) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Dashboard Admin" }],
                });
              }
              else {
                try {
                  onValue(ref(database, 'users/'), (snapshot) => {
                    if (snapshot.exists()) {
                      if (!snapshot.val()[auth.currentUser.phoneNumber]) {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Signup' }],
                        });
                      }
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                      });
                    }
                  })
                }
                catch (error) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Signup' }],
                  });
                }
              }
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }}
        >
          <Text style={styles.text}>Confirm Verification Code</Text>
        </Pressable>
        {message ? (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 0xffffffee, justifyContent: 'center' },
            ]}
            onPress={() => showMessage(undefined)}>
            <Text
              style={{
                color: message.color || 'blue',
                fontSize: moderateScale(16),
                textAlign: 'center',
                margin: scale(20),
              }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    </SafeAreaView>
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
    elevation: scale(18),
    backgroundColor: 'black',
  },
  text: {
    fontSize: moderateScale(16),
    lineHeight: scale(18),
    fontWeight: 'bold',
    letterSpacing: scale(0.5),
    color: 'white',
  },
});