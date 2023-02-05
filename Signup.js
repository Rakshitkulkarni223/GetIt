// import React, { useState, createRef } from "react";
// import {
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Keyboard,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";

// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import { app, auth, db } from "./Firebase";
// import { database } from "./Firebase";
// import { ref, set } from "firebase/database";

// const SaveInfo = async (id, name, email, password) => {

//   set(ref(database, 'users/' + id), {
//     username: name,
//     email: email,
//     password: password
//   });

// };

// const SignUp = ({ navigation }) => {
//   const [userName, setUserName] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [userPassword, setUserPassword] = useState("");
//   const [errortext, setErrortext] = useState("");

//   const emailInputRef = createRef();
//   const passwordInputRef = createRef();

//   const handleSubmitButton = async () => {
//     setErrortext("");
//     if (!userName) return alert("Please fill Name");
//     if (!userEmail) return alert("Please fill Email");
//     if (!userPassword) return alert("Please fill Address");

//     await createUserWithEmailAndPassword(auth,
//       userEmail,
//       userPassword
//     )
//       .then((user) => {
//         if (user) {
//           SaveInfo(user["user"]["uid"], userName, userEmail, userPassword);
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' }],
//         });
//         }
//       })
//       .catch((error) => {
//         if (error.code === "auth/email-already-in-use") {
//           setErrortext(
//             "That email address is already in use!"
//           );
//         } else {
//           setErrortext(error.message);
//         }
//       });
//   };

//   return (
//     <SafeAreaView
//       style={{ flex: 1, backgroundColor: "#307ecc" }}
//     >
//       <ScrollView
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={{
//           justifyContent: "center",
//           alignContent: "center",
//         }}
//       >
//         <View style={{ alignItems: "center" }}>
//         </View>
//         <KeyboardAvoidingView enabled>
//           <View style={styles.sectionStyle}>
//             <TextInput
//               style={styles.inputStyle}
//               onChangeText={(UserName) =>
//                 setUserName(UserName)
//               }
//               underlineColorAndroid="#f000"
//               placeholder="Enter Full Name"
//               placeholderTextColor="#8b9cb5"
//               autoCapitalize="sentences"
//               returnKeyType="next"
//               onSubmitEditing={() =>
//                 emailInputRef.current &&
//                 emailInputRef.current.focus()
//               }
//               blurOnSubmit={false}
//             />
//           </View>
//           <View style={styles.sectionStyle}>
//             <TextInput
//               style={styles.inputStyle}
//               onChangeText={(UserEmail) =>
//                 setUserEmail(UserEmail)
//               }
//               underlineColorAndroid="#f000"
//               placeholder="Enter Email"
//               placeholderTextColor="#8b9cb5"
//               keyboardType="email-address"
//               ref={emailInputRef}
//               returnKeyType="next"
//               onSubmitEditing={() =>
//                 passwordInputRef.current &&
//                 passwordInputRef.current.focus()
//               }
//               blurOnSubmit={false}
//             />
//           </View>
//           <View style={styles.sectionStyle}>
//             <TextInput
//               style={styles.inputStyle}
//               onChangeText={(UserPassword) =>
//                 setUserPassword(UserPassword)
//               }
//               underlineColorAndroid="#f000"
//               placeholder="Enter Password"
//               placeholderTextColor="#8b9cb5"
//               ref={passwordInputRef}
//               returnKeyType="next"
//               secureTextEntry={true}
//               onSubmitEditing={Keyboard.dismiss}
//               blurOnSubmit={false}
//             />
//           </View>
//           {errortext != "" ? (
//             <Text style={styles.errorTextStyle}>
//               {" "}
//               {errortext}{" "}
//             </Text>
//           ) : null}
//           <TouchableOpacity
//             style={styles.buttonStyle}
//             activeOpacity={0.5}
//             onPress={handleSubmitButton}
//           >
//             <Text style={styles.buttonTextStyle}>
//               REGISTER
//             </Text>
//           </TouchableOpacity>
//         </KeyboardAvoidingView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// export default SignUp;

// const styles = StyleSheet.create({
//   sectionStyle: {
//     flexDirection: "row",
//     height: 40,
//     marginTop: 20,
//     marginLeft: 35,
//     marginRight: 35,
//     margin: 10,
//   },
//   buttonStyle: {
//     backgroundColor: "#7DE24E",
//     borderWidth: 0,
//     color: "#FFFFFF",
//     borderColor: "#7DE24E",
//     height: 40,
//     alignItems: "center",
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   buttonTextStyle: {
//     color: "#FFFFFF",
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   inputStyle: {
//     flex: 1,
//     color: "white",
//     paddingLeft: 15,
//     paddingRight: 15,
//     borderWidth: 1,
//     borderRadius: 30,
//     borderColor: "#dadae8",
//   },
//   errorTextStyle: {
//     color: "red",
//     textAlign: "center",
//     fontSize: 14,
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { app, auth, db } from "./Firebase";
import { database } from "./Firebase";
import { ref, set } from "firebase/database";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native';

import { normalize } from './FontResize';

import { scale, moderateScale, verticalScale } from './Dimensions';


const SignUp = ({ navigation }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [DOB, setDOB] = useState('DD/MM/YYYY');
  const [DOBfontweight, setDOBfontweight] = useState('100');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const [message, showMessage] = useState();

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
    if (!firstName) return alert("Please enter first name");
    if (!lastName) return alert("Please enter last name");
    if (DOB==='DD/MM/YYYY') return alert("Please enter date of birth");
    if (!email) return alert("Please enter email");
    if (!password) return alert("Please enter password");


    try{
      SaveInfo(auth.currentUser.phoneNumber, firstName, lastName, DOB, email, password);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
    }
    catch(error){
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
      <View style={{ padding: scale(18), marginTop: verticalScale(20) }}>
        <View
          style={{
            borderWidth: scale(0.5),
            borderRadius: scale(5),
            // marginTop: verticalScale(10),
          }}
        >
          <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>First name</Text>
          <TextInput
            style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
            placeholder="Enter first name"
            autoFocus
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
              style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light'}}
              placeholder="Enter last name"
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
          <Text style={{  marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>DOB</Text>
          <Text
            style={{
              marginLeft: scale(10), marginBottom: verticalScale(5), marginTop: verticalScale(5), fontSize: normalize(14),
              fontWeight: DOBfontweight,
            }}
            onPress={showDatePicker}
          >{DOB}</Text>
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
          <TextInput
            style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
            placeholder="xyz@abc.com"
            keyboardType="default"
            onChangeText={(email) => {
              setemail(email)
            }}
          />
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
            style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
            placeholder="xyz"
            keyboardType="default"
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
          {/* <Button
            title="Sign Up"
            disabled={!firstName || !lastName || !DOB || !email || !password}
            onPress={handleSubmitButton}
          /> */}
          <Pressable style={styles.button} onPress={handleSubmitButton}>
            <Text style={styles.text}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


export default SignUp;


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
    fontWeight: 'bold',
    letterSpacing: scale(0.5),
    color: 'white',
  },
});