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
  StatusBar,
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

  const [showpassword, setshowpassword] = useState(false);

  const [message, showMessage] = useState();

  const [ProfilePic, setProfilePic] = useState(route && route.params ? route.params.ProfilePic : 'https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788');

  const [validatedEmail, setvalidatedEmail] = useState(false);

  const [selectMode, setselectMode] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: '',
      // headerStyle: {
      //     backgroundColor: '#3EA879',
      //     backgroundColor: '#718A8E',
      // }
    })

    // navigation.setOptions({
    //   title: "",
    //   headerStyle: {
    //     backgroundColor: '#718A8E',
    //     // backgroundColor: '#8297C4',
    //   },
    //   headerLeft: () => (
    //     <View style={{
    //       flex: 1,
    //       flexDirection: 'row',
    //       // justifyContent: 'space-around'
    //     }}>
    //       {route && route.params ? <Text style={{
    //         fontSize: normalize(14),
    //         color: '#fff',
    //         fontWeight: '400',
    //         letterSpacing: scale(0.8),
    //       }}>
    //         {"Update Profile".toUpperCase()}
    //       </Text> :
    //         <Text>
    //           User Profile
    //         </Text>}
    //     </View>
    //   )
    // })
  }, [])

  useEffect(() => {
    if (route && route.params && route.params.email !== '') {
      emailValidation(route.params.email);
    }

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D8DFE7'}}>
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

        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          margin: scale(10)
          // justifyContent: 'space-around'
        }}>
          {route && route.params ? <Text style={{
            fontSize: normalize(16),
            fontWeight: '500',
            letterSpacing: scale(0.5),
            paddingVertical: verticalScale(1),
            paddingHorizontal: scale(15),
            borderBottomWidth: scale(0.7),
            borderBottomColor: "#000",
            color: '#000'
          }}>
            {"Update Profile".toUpperCase()}
          </Text> :
            <Text style={{
              fontSize: normalize(18),
              fontWeight: '500',
              letterSpacing: scale(0.5),
              paddingVertical: verticalScale(1),
              paddingHorizontal: scale(15),
              borderBottomWidth: scale(0.7),
              borderBottomColor: "#000",
              color: '#000'
            }}>
              User Profile
            </Text>}
        </View>


        <ActivityIndicatorElement loading={loading} />

        <Modal visible={selectMode} transparent={true}>
          <View style={{
            flex: 0.2,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            top: "40%",
            backgroundColor: '#DEDEE2',
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
              <AntDesign name="close" size={normalize(18)} color="#2F3032"
                onPress={() => {
                  setselectMode(false)
                }}
              />
            </View>

            <View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginVertical: verticalScale(10)
            }}>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: scale(30),
              }}>

                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Feather name="camera" size={normalize(20)} color="#50597E" />
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
                      color: '#000'
                    }}>Open Camera</Text>
                  </TouchableOpacity>
                </View>

              </View>


              <View style={{
                // flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: scale(30),
                marginVertical: ProfilePic !== 'https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788' ? verticalScale(10) : verticalScale(20),
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
                      color: '#000'
                    }}>Select From Gallery</Text>
                  </TouchableOpacity>
                </View>

              </View>

              {ProfilePic !== 'https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FProfile.png?alt=media&token=9b0173fb-4b95-4783-93c7-f928cffbd788' ?

                <View style={{
                  // flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginLeft: scale(30),
                  // marginVertical: verticalScale(5),
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
                        color: '#000'
                      }}>Remove Profile</Text>
                    </TouchableOpacity>
                  </View>

                </View> : undefined}

            </View>
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
          }}>
            <Image
              style={{
                width: Dimensions.get('window').width * 0.5,
                height: Dimensions.get('window').width * 0.5,
                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                borderWidth: scale(1),
                overflow: "hidden",
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
        <View style={{ padding: scale(18), marginTop: verticalScale(10) }}>
          <View
            style={{
              borderWidth: scale(0.5),
              borderRadius: scale(5),
            }}
          >
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), letterSpacing: scale(0.4), 
              fontWeight: '200',}}>First name</Text>
            <TextInput
              style={{
                marginLeft: scale(10), marginBottom: verticalScale(3),
                fontSize: normalize(14),
                fontWeight: '400', 
              }}
              defaultValue={route && route.params ? route.params.firstName : ""}
              placeholder="Enter first name"
              keyboardType="default"
              letterSpacing={scale(0.4)}
              onChangeText={(firstName) => {
                setfirstName(firstName)
              }}
            />
            <View style={{
              borderTopWidth: scale(0.5)
            }}>
              <Text style={{
                marginLeft: scale(10), marginTop: verticalScale(5), letterSpacing: scale(0.4), 
                // fontFamily: 'sans-serif-thin'
                fontWeight: '200'
              }}>Last name</Text>
              <TextInput
                style={{ marginLeft: scale(10), marginBottom: verticalScale(3), fontSize: normalize(14), 
                  // fontFamily: 'sans-serif-light'
                  fontWeight: '400', 
                }}
                placeholder="Enter last name"
                defaultValue={route && route.params ? route.params.lastName : ""}
                keyboardType="default"
                letterSpacing={scale(0.4)}
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
            <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), letterSpacing: scale(0.4), 
               fontWeight: '200', 
              }}>DOB</Text>
            <Text
              style={{
                marginLeft: scale(10),marginBottom: verticalScale(3), marginTop: verticalScale(2), fontSize: normalize(14),
                fontWeight: DOBfontweight,
                fontWeight: '400', 
              }}
              onPress={showDatePicker}
            >
              {DOB === "DD/MM/YYYY" ? route && route.params ? route.params.DOB === '' ? DOB : DOB : DOB : DOB}
            </Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              letterSpacing={scale(0.4)}
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
            <View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), letterSpacing: scale(0.4),fontWeight: '200',}}>Email</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: scale(10), marginBottom: verticalScale(3),
              }}>
                <View style={{
                  width: '85%',
                  justifyContent: 'center'
                }}>
                  <TextInput
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '400', 
                    }}
                    placeholder="email@address.com"
                    keyboardType="default"
                    letterSpacing={scale(0.4)}
                    defaultValue={route && route.params ? route.params.email : ""}
                    onChangeText={(email) => {
                      emailValidation(email)
                    }}
                  />
                </View>

                <View style={{
                  justifyContent: 'center'
                }}>
                  {validatedEmail ?
                    <Ionicons name="checkmark-circle-outline" size={normalize(16)} color="green" />
                    : <MaterialIcons name="error-outline" size={normalize(16)} color="red" />}
                </View>

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

            <View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <Text style={{ marginLeft: scale(10), letterSpacing: scale(0.4), marginTop: verticalScale(5), fontWeight: '200', }}>Password</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: scale(10),marginBottom: verticalScale(3),
              }}>
                <View style={{
                  width: '85%',
                  justifyContent: 'center'
                }}>

                  <TextInput
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '400', 
                    }}
                    placeholder={route && route.params ? route.params.password === '' ? "Must have atleast 6 characters" : "Password cannot be updated here" : "Must have atleast 6 characters"}
                    keyboardType="default"
                    secureTextEntry={!showpassword}
                    letterSpacing={scale(0.4)}
                    editable={route && route.params ? route.params.password === '' ? true : false : true}
                    onChangeText={(password) => {
                      setpassword(password)
                    }}
                  />
                </View>
                <View style={{
                  justifyContent: 'center'
                }}>
                  <Ionicons name={showpassword ? "eye-outline" : "eye-off-outline"} size={normalize(16)} color={showpassword ? "#14B26D" : "#D80A20"} onPress={() => {
                    if (!(route && route.params && route.params.password !== '')) {
                      setshowpassword(!showpassword);
                    }
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
            marginTop: verticalScale(20),
          }}>
            <TouchableOpacity style={styles.button} onPress={handleSubmitButton}>
              <Text style={styles.text}>
                Save Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{
            marginTop: verticalScale(20),
          }}>
            <TouchableOpacity style={{
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
                      Latitude: route.params.latitude,
                      gotoSignup: false,
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
                      disableNotification: true,
                      gotoSignup: false,
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
            </TouchableOpacity>
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
    borderWidth: scale(0.7),
    backgroundColor: '#000',
    borderColor: 'white',
  },
  text: {
    fontSize: normalize(16),
    lineHeight: verticalScale(20),
    fontWeight: 'bold',
    letterSpacing: scale(0.8),
    color: 'white',
  },
});