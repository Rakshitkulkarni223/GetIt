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
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { app, auth, db } from "./Firebase";
import { database } from "./Firebase";
import { ref, set } from "firebase/database";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native';

import { normalize } from './FontResize';

import { EvilIcons, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from './Dimensions';
import ActivityIndicatorElement from './ActivityIndicatorElement';
import DashboardUser from './DashboardUser';
import Main from './Main';


const SignUp = ({ navigation, route }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [loading, setloading] = useState(false);

  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [DOB, setDOB] = useState('DD/MM/YYYY');
  const [DOBfontweight, setDOBfontweight] = useState('100');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const [message, showMessage] = useState();

  const [validatedEmail, setvalidatedEmail] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.email !== '') {
      emailValidation(route.params.email);
    }
    navigation.setOptions({
      title: route && route.params ? "Update Information" : "User Information",
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
    setemail(email)
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setvalidatedEmail(mailformat.test(email));
  }

  const SaveInfo = async (id, firstName, lastName, DOB, email, password) => {

    firstName = firstName.trim()
    lastName = lastName.trim()
    email = email.trim()
    password = password.trim()

    set(ref(database, 'users/' + id), {
      firstName: firstName,
      lastName: lastName,
      Dob: DOB,
      phoneNumber: auth.currentUser.phoneNumber,
      email: email,
      password: password
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
      SaveInfo(auth.currentUser.phoneNumber, firstName, lastName, DOB, email, password);
      setloading(false)
      // setgotoDashboardUser(true)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
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

  return (
    <SafeAreaView style={{ flex: 1 }}>

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

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: verticalScale(15),
          borderWidth: scale(0.5),
          borderRadius: scale(100),
          borderColor: '#4E858C',
          padding: scale(30)
        }}>
          <FontAwesome5 name="user" size={normalize(25)} color="#4C486C" />
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
              defaultValue={route &&  route.params ? route.params.lastName : ""}
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
            {DOB==="DD/MM/YYYY" ? route && route.params ? route.params.DOB : DOB: DOB}
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
            placeholder={route && route.params ? "Password cannot be updated" : "Must have atleast 6 characters"}
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
              {route && route.params ? "Update Info" : "Save Info"}
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
            elevation: scale(10),
            borderWidth: scale(1),
            borderColor: 'black',
            backgroundColor: 'white',
          }} onPress={() => {
            setloading(true)
            SaveInfo(auth.currentUser.phoneNumber, firstName, lastName, DOB, email, password);
            setloading(false)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
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
    elevation: scale(10),
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



// import React, { useState, useEffect } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   Pressable,
// } from 'react-native';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import { app, auth, db } from "./Firebase";
// import { database } from "./Firebase";
// import { ref, set } from "firebase/database";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { SafeAreaView } from 'react-native';

// import { normalize } from './FontResize';

// import { scale, moderateScale, verticalScale } from './Dimensions';
// import ActivityIndicatorElement from './ActivityIndicatorElement';


// const SignUp = ({ navigation }) => {

//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const [loading, setloading] = useState(false);

//   const [firstName, setfirstName] = useState('')
//   const [lastName, setlastName] = useState('')
//   const [DOB, setDOB] = useState('DD/MM/YYYY');
//   const [DOBfontweight, setDOBfontweight] = useState('100');
//   const [email, setemail] = useState('');
//   const [password, setpassword] = useState('');

//   const [message, showMessage] = useState();

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     const yyyy = date.getFullYear();
//     let mm = date.getMonth() + 1; // Months start at 0!
//     let dd = date.getDate();

//     if (dd < 10) dd = '0' + dd;
//     if (mm < 10) mm = '0' + mm;

//     setDOB(dd + '/' + mm + '/' + yyyy)
//     setDOBfontweight('400')

//     hideDatePicker();
//   };

//   const SaveInfo = async (id, firstName, lastName, DOB, email, password) => {

//     firstName = firstName.trim()
//     lastName = lastName.trim()
//     email = email.trim()
//     password = password.trim()

//     set(ref(database, 'users/' + id), {
//       firstName: firstName,
//       lastName: lastName,
//       Dob: DOB,
//       phoneNumber: auth.currentUser.phoneNumber,
//       email: email,
//       password: password
//     });
//   };

//   const handleSubmitButton = async () => {
//     showMessage("");
//     if (!firstName) return alert("Please enter first name");
//     if (!lastName) return alert("Please enter last name");
//     if (DOB === 'DD/MM/YYYY') return alert("Please enter date of birth");
//     if (!email) return alert("Please enter email");
//     if (!password) return alert("Please enter password");
//     setloading(true)


//     try {
//       SaveInfo(auth.currentUser.phoneNumber, firstName, lastName, DOB, email, password);
//       setloading(false)
//       navigation.replace("Home")
//       // navigation.reset({
//       //   index: 0,
//       //   routes: [{ name: 'Home' }],
//       // });
//     }
//     catch (error) {
//       setloading(false)
//       showMessage(error);
//     }

//     // await createUserWithEmailAndPassword(auth,
//     //   email,
//     //   password
//     // ).then((user) => {
//     //   if (user) {
//     //     SaveInfo(user["user"]["uid"], firstName, lastName, DOB, email, password);
//     //     navigation.reset({
//     //       index: 0,
//     //       routes: [{ name: 'Home' }],
//     //     });
//     //   }
//     // })
//     //   .catch((error) => {
//     //     if (error.code === "auth/email-already-in-use") {
//     //       showMessage(
//     //         "This email address is already in use!"
//     //       );
//     //     } else {
//     //       showMessage(error.message);
//     //     }
//     //   });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ActivityIndicatorElement loading={loading} />
//       <View style={{ padding: scale(18), marginTop: verticalScale(20) }}>
//         <View
//           style={{
//             borderWidth: scale(0.5),
//             borderRadius: scale(5),
//             // marginTop: verticalScale(10),
//           }}
//         >
//           <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>First name</Text>
//           <TextInput
//             style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
//             placeholder="Enter first name"
//             autoFocus
//             keyboardType="default"
//             onChangeText={(firstName) => {
//               setfirstName(firstName)
//             }}
//           />
//           <View style={{
//             borderTopWidth: scale(0.5)
//           }}>
//             <Text style={{
//               marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
//             }}>Last name</Text>
//             <TextInput
//               style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
//               placeholder="Enter last name"
//               keyboardType="default"
//               onChangeText={(lastName) => {
//                 setlastName(lastName)
//               }}
//             />
//           </View>
//         </View>
//         <View
//           style={{
//             borderWidth: scale(0.5),
//             borderRadius: scale(5),
//             marginTop: verticalScale(10),
//           }}
//         >
//           <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>DOB</Text>
//           <Text
//             style={{
//               marginLeft: scale(10), marginBottom: verticalScale(5), marginTop: verticalScale(5), fontSize: normalize(14),
//               fontWeight: DOBfontweight,
//             }}
//             onPress={showDatePicker}
//           >{DOB}</Text>
//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             onConfirm={handleConfirm}
//             onCancel={hideDatePicker}
//           />
//         </View>
//         <View
//           style={{
//             borderWidth: scale(0.5),
//             borderRadius: scale(5),
//             marginTop: verticalScale(10),
//           }}
//         >
//           <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Email</Text>
//           <TextInput
//             style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
//             placeholder="xyz@abc.com"
//             keyboardType="default"
//             onChangeText={(email) => {
//               setemail(email)
//             }}
//           />
//         </View>

//         <View
//           style={{
//             borderWidth: scale(0.5),
//             borderRadius: scale(5),
//             marginTop: verticalScale(10),
//           }}
//         >
//           <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Password</Text>
//           <TextInput
//             style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
//             placeholder="xyz"
//             keyboardType="default"
//             onChangeText={(password) => {
//               setpassword(password)
//             }}
//           />
//         </View>
//         {message ? (
//           <Text
//             style={{
//               color: 'red',
//               fontSize: normalize(16),
//               textAlign: 'center',
//               marginTop: scale(20),
//             }}>
//             {message}
//           </Text>
//         ) : undefined}
//         <View style={{
//           marginTop: verticalScale(20),
//         }}>
//           <Pressable style={styles.button} onPress={handleSubmitButton}>
//             <Text style={styles.text}>Sign Up</Text>
//           </Pressable>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }


// export default SignUp;


// const styles = StyleSheet.create({
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: verticalScale(8),
//     paddingHorizontal: scale(32),
//     borderRadius: scale(4),
//     elevation: scale(10),
//     backgroundColor: 'black',
//   },
//   text: {
//     fontSize: normalize(16),
//     lineHeight: verticalScale(20),
//     fontWeight: 'bold',
//     letterSpacing: scale(0.5),
//     color: 'white',
//   },
// });