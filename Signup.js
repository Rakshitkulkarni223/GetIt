import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Pressable,
  Alert,
  Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { app, auth, db, storage } from "./Firebase";
import { database } from "./Firebase";
import { ref, set } from "firebase/database";

import * as Notifications from 'expo-notifications';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native';

import { normalize } from './FontResize';

import { AntDesign, EvilIcons, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from './Dimensions';
import ActivityIndicatorElement from './ActivityIndicatorElement';
import DashboardUser from './DashboardUser';
import Main from './Main';

import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { NotificationPermission } from './NotificationHandler';


const SignUp = ({ navigation, route }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [loading, setloading] = useState(false);

  const [firstName, setfirstName] = useState(route && route.params ? route.params.firstName : '')
  const [lastName, setlastName] = useState(route && route.params ? route.params.lastName : '')
  const [DOB, setDOB] = useState(route && route.params ? route.params.DOB === '' ? 'DD/MM/YYYY' : route.params.DOB : 'DD/MM/YYYY');
  const [DOBfontweight, setDOBfontweight] = useState('100');
  const [email, setemail] = useState(route && route.params ? route.params.email : '')
  const [password, setpassword] = useState(route && route.params ? route.params.password : '')

  const [message, showMessage] = useState();

  const [ProfilePic, setProfilePic] = useState(route && route.params ? route.params.ProfilePic : 'https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788');

  const [validatedEmail, setvalidatedEmail] = useState(false);

  const [selectMode, setselectMode] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.email !== '') {
      emailValidation(route.params.email);
    }
    navigation.setOptions({
      headerLeft: () => <></>,
      title: route && route.params ? "Update Profile" : "User Profile",
      headerTintColor: '#fff',
      headerTitleStyle: {
        // fontWeight: 'bold',
        fontSize: normalize(15),
      },
      headerStyle: {
        backgroundColor: '#46AA66',
        // backgroundColor: '#8297C4',
      },
    })
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    setDOB(dd + '/' + mm + '/' + yyyy)
    setDOBfontweight('400')

    hideDatePicker();
  };

  const emailValidation = (email) => {
    email = email.trim()
    setemail(email)
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setvalidatedEmail(mailformat.test(email));
  }

  const SaveInfo = async (ProfilePic, id, firstName, lastName, DOB, email, password) => {

    firstName = firstName ? firstName.trim() : firstName
    lastName = lastName ? lastName.trim() : lastName
    email = email ? email.trim() : email
    password = password ? password.trim() : password

    await NotificationPermission();

    var token = (await Notifications.getExpoPushTokenAsync()).data;

    set(ref(database, `users/${id}/userDetails/`), {
      ProfilePic: ProfilePic,
      firstName: firstName,
      lastName: lastName,
      Dob: DOB,
      phoneNumber: auth.currentUser.phoneNumber,
      email: email,
      password: password,
      fcmToken: token
    });
  };


  const handleSubmitButton = async () => {
    showMessage("");

    // if (!firstName) return alert("Please enter first name");
    // if (!lastName) return alert("Please enter last name");
    // if (DOB === 'DD/MM/YYYY') return alert("Please enter date of birth");
    if (!validatedEmail) return Alert.alert("Invalid Email Id", "Please enter valid email id");
    if (route && !route.params && password.length < 6) return Alert.alert("Password length should be atleast 6");


    try {
      setloading(true)
      SaveInfo(ProfilePic, auth.currentUser.phoneNumber, firstName, lastName, DOB, email, password);
      setloading(false)
      // setgotoDashboardUser(true)
      if (route && route.params) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Home',
            params: {
              disableNotification: true, changeAddress: false, Location: route.params.displayCurrentAddress,
              Longitude: route.params.longitude,
              Latitude: route.params.latitude
            }
          }],
        });
      }
      else {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Home',
            params: {
              disableNotification: true
            }
          }],
        });
      }

    }
    catch (error) {
      setloading(false)
      showMessage(error);
    }

    // await createUserWithEmailAndPassword(auth,
    //   email,
    //   password
    // ).then((user) => {
    //   if (user) {
    //     SaveInfo(user["user"]["uid"], firstName, lastName, DOB, email, password);
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: 'Home' }],
    //     });
    //   }
    // })
    //   .catch((error) => {
    //     if (error.code === "auth/email-already-in-use") {
    //       showMessage(
    //         "This email address is already in use!"
    //       );
    //     } else {
    //       showMessage(error.message);
    //     }
    //   });
  };

  const showImagePicker = async () => {


    setselectMode(false)
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();


    if (permissionResult.granted === false) {
      setloading(false)
      Alert.alert("You've refused to allow this appp to access your photos!");
      return;
    }


    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result['canceled']) {
      // setProfilePic(result['assets'][0]["uri"]);
      const url = await uploadImage(result['assets'][0]["uri"], auth.currentUser.phoneNumber);
      setProfilePic(url)
    }

    setloading(false)
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {


    setselectMode(false)
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();


    if (permissionResult.granted === false) {
      setloading(false)
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    setloading(true)

    const result = await ImagePicker.launchCameraAsync();

    if (!result['canceled']) {
      const url = await uploadImage(result['assets'][0]["uri"], auth.currentUser.phoneNumber);
      setProfilePic(url)
    }

    setloading(false)
  }

  const uploadImage = async (image, id) => {

    setloading(true)
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          // console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      const fileRef = sref(storage, `Images/${id}`);
      const result = await uploadBytes(fileRef, blob);

      blob.close();
      setloading(false)

      const url = await getDownloadURL(fileRef);
      setloading(false)
      return url;
    }
    catch (error) {
      setloading(false)
      Alert.alert("Image Not Uploaded!!");
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D8DFE7' }}>
      <ScrollView>

        {route && route.params ? <View></View> :

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: verticalScale(10),
          }}>
            <View style={[styles.progressBar, { backgroundColor: '#69D9B9' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
            <View style={[styles.progressBar, { backgroundColor: '#69D9B9' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
            <View style={[styles.progressBar, { backgroundColor: '#69D9B9' }]}>
              <Animated.View style={[StyleSheet.absoluteFill]} />
            </View>
          </View>
        }


        <ActivityIndicatorElement loading={loading} />

        <Modal visible={selectMode} transparent={true}>
          <View style={{
            flex: 0.2,
            flexDirection: 'column',
            justifyContent: 'center',
            top: "40%",
            backgroundColor: '#413D3D',
            // height: verticalScale(30),
            borderWidth: scale(1),
            borderColor: 'black',
            borderRadius: scale(10),
            margin: scale(25),

          }}>

            <View style={{
              // flex: 0.1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginLeft: scale(30),
            }}>
              <AntDesign name="close" size={normalize(18)} color="red"
                onPress={() => {
                  setselectMode(false)
                }}
              />
            </View>

            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginLeft: scale(30),
            }}>

              <View style={{
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Feather name="camera" size={normalize(20)} color="#715AE1" />
              </View>

              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: scale(12),
              }}>
                <TouchableOpacity onPress={openCamera}>
                  <Text style={{
                    fontSize: normalize(14),
                    fontWeight: '600',
                    letterSpacing: scale(0.3),
                    color: '#fff'
                  }}>Open Camera</Text>
                </TouchableOpacity>
              </View>

            </View>


            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginLeft: scale(30),
              marginBottom: !ProfilePic ? verticalScale(10) : 0,
              // marginTop: scale(10),
            }}>

              <View style={{
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <AntDesign name="picture" size={normalize(20)} color="#23A78D" />
              </View>

              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: scale(12),
              }}>
                <TouchableOpacity onPress={showImagePicker}>
                  <Text style={{
                    fontSize: normalize(14),
                    fontWeight: '600',
                    letterSpacing: scale(0.3),
                    color: '#fff'
                  }}>Select From Gallery</Text>
                </TouchableOpacity>
              </View>

            </View>

            {ProfilePic !== 'https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788' ?

              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: scale(30),
                marginBottom: verticalScale(10),
                // marginTop: scale(10),
              }}>

                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <MaterialIcons name="delete-outline" size={normalize(20)} color="#D84329"
                    onPress={() => {
                      setProfilePic('https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788')
                      setselectMode(false)
                    }}
                  />
                </View>

                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginLeft: scale(12),
                }}>
                  <TouchableOpacity onPress={() => {
                    setProfilePic('https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788')
                    setselectMode(false)
                  }}>
                    <Text style={{
                      fontSize: normalize(14),
                      fontWeight: '600',
                      letterSpacing: scale(0.3),
                      color: '#fff'
                    }}>Remove Profile</Text>
                  </TouchableOpacity>
                </View>

              </View> : undefined}

          </View>
        </Modal>

        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: verticalScale(15),
            // borderWidth: scale(0.5),
            // borderRadius: scale(100),
            // borderColor: '#4E858C',
            //   width: scale(170),
            //     height: verticalScale(180),
            // padding: scale(30)
          }}>
            {/* <FontAwesome5 name="user" size={normalize(25)} color="#4C486C" /> */}

            <Image
              style={{
                width: Dimensions.get('window').width * 0.5,
                height: Dimensions.get('window').width * 0.5,
                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                borderWidth: scale(1),
                borderColor: '#3F999E',
                resizeMode: 'cover'
              }}
              source={{
                uri: ProfilePic
              }}
              onLoadStart={() => setloading(true)}
              onLoadEnd={() => {
                setloading(false)
              }}
            />


          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: scale(40),
            marginLeft: scale(200),
            backgroundColor: '#6888AB',
            marginTop: verticalScale(-35),
            padding: scale(8),
            borderWidth: scale(1),
            borderRadius: scale(100),
          }}>
            <MaterialCommunityIcons name="camera-plus-outline" size={normalize(22)} color="black"
              onPress={() => {
                setselectMode(true)
              }}
            />
          </View>
        </View>
        <View style={{ padding: scale(18), marginTop: verticalScale(5) }}>
          <View
            style={{
              borderWidth: scale(0.5),
              borderRadius: scale(5),
            }}
          >
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>First name</Text>
            <TextInput
              style={{
                marginLeft: scale(10), marginBottom: verticalScale(5),
                fontSize: normalize(14),
                fontFamily: 'sans-serif-light',
              }}
              defaultValue={route && route.params ? route.params.firstName : ""}
              placeholder="Enter first name"
              keyboardType="default"
              onChangeText={(firstName) => {
                setfirstName(firstName)
              }}
            />
            <View style={{
              borderTopWidth: scale(0.5)
            }}>
              <Text style={{
                marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
              }}>Last name</Text>
              <TextInput
                style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                placeholder="Enter last name"
                defaultValue={route && route.params ? route.params.lastName : ""}
                keyboardType="default"
                onChangeText={(lastName) => {
                  setlastName(lastName)
                }}
              />
            </View>
          </View>
          <View
            style={{
              borderWidth: scale(0.5),
              borderRadius: scale(5),
              marginTop: verticalScale(10),
            }}
          >
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>DOB</Text>
            <Text
              style={{
                marginLeft: scale(10), marginBottom: verticalScale(5), marginTop: verticalScale(5), fontSize: normalize(14),
                fontWeight: DOBfontweight,
                fontFamily: 'sans-serif-light',
              }}
              onPress={showDatePicker}
            >
              {DOB === "DD/MM/YYYY" ? route && route.params ? route.params.DOB === '' ? DOB : DOB : DOB : DOB}
            </Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View
            style={{
              borderWidth: scale(0.5),
              borderRadius: scale(5),
              marginTop: verticalScale(10),
            }}
          >
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Email</Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
              <View style={{
                marginRight: scale(40),
              }}>
                <TextInput
                  style={{
                    marginLeft: scale(10),
                    marginBottom: verticalScale(5),
                    fontSize: normalize(14),
                    fontFamily: 'sans-serif-light'
                  }}
                  placeholder="email@address.com"
                  keyboardType="default"
                  defaultValue={route && route.params ? route.params.email : ""}
                  onChangeText={(email) => {
                    emailValidation(email)
                  }}
                />
              </View>
              <View style={{
                marginLeft: scale(290),
                position: 'absolute',
                alignItems: 'center'
              }}>
                {validatedEmail ?
                  <Ionicons name="checkmark-circle-outline" size={normalize(18)} color="green" />
                  : <MaterialIcons name="error-outline" size={normalize(18)} color="red" />}
              </View>
            </View>
          </View>

          <View
            style={{
              borderWidth: scale(0.5),
              borderRadius: scale(5),
              marginTop: verticalScale(10),
            }}
          >
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Password</Text>
            <TextInput
              style={{
                marginLeft: scale(10),
                marginBottom: verticalScale(5),
                fontSize: normalize(14),
                fontFamily: 'sans-serif-light'
              }}
              placeholder={route && route.params ? "Password cannot be updated here" : "Must have atleast 6 characters"}
              keyboardType="default"
              secureTextEntry
              editable={route && route.params ? false : true}
              onChangeText={(password) => {
                setpassword(password)
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
            <Pressable style={styles.button} onPress={handleSubmitButton}>
              <Text style={styles.text}>
                {route && route.params ? "Update Profile" : "Save Profile"}
              </Text>
            </Pressable>
          </View>
          <View style={{
            marginTop: verticalScale(20),
          }}>
            <Pressable style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: verticalScale(8),
              paddingHorizontal: scale(32),
              borderRadius: scale(4),
              elevation: scale(4),
              borderWidth: scale(1),
              borderColor: 'black',
              backgroundColor: 'white',
            }} onPress={() => {
              setloading(true)
              SaveInfo(route && route.params ? route.params.ProfilePic === ProfilePic ? ProfilePic : route.params.ProfilePic : ProfilePic, auth.currentUser.phoneNumber,
                route && route.params ? route.params.firstName === firstName ? firstName : route.params.firstName : '',
                route && route.params ? route.params.lastName === lastName ? lastName : route.params.lastName : '',
                route && route.params ? route.params.DOB === DOB ? DOB : route.params.DOB : '',
                route && route.params ? route.params.email === email ? email : route.params.email : '',
                route && route.params ? route.params.password === password ? password : route.params.password : '');
              setloading(false)
              if (route && route.params) {
                navigation.reset({
                  index: 0,
                  routes: [{
                    name: 'Home',
                    params: {
                      disableNotification: true, changeAddress: false, Location: route.params.displayCurrentAddress,
                      Longitude: route.params.longitude,
                      Latitude: route.params.latitude
                    }
                  }],
                });
              }
              else {
                navigation.reset({
                  index: 0,
                  routes: [{
                    name: 'Home',
                    params: {
                      disableNotification: true
                    }
                  }],
                });
              }

            }}>
              <Text style={{
                fontSize: normalize(16),
                lineHeight: verticalScale(20),
                fontWeight: 'bold',
                letterSpacing: scale(0.5),
                color: 'black',
              }}>Not Now</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


export default SignUp;


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
    borderRadius: scale(4),
    elevation: scale(4),
    backgroundColor: 'black',
  },
  text: {
    fontSize: normalize(16),
    lineHeight: verticalScale(20),
    fontWeight: 'bold',
    letterSpacing: scale(0.5),
    color: 'white',
  },
});