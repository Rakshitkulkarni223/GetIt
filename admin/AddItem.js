// import React, { useState, createRef } from "react";
// import {
//     SafeAreaView,
//     StyleSheet,
//     TextInput,
//     View,
//     Text,
//     KeyboardAvoidingView,
//     Keyboard,
//     TouchableOpacity,
//     ScrollView,
//     Image,
// } from "react-native";

// import { app, auth, db, database } from "../Firebase";
// import { ref, set, onValue } from "firebase/database";

// import * as ImagePicker from 'expo-image-picker';

// import { Feather, AntDesign } from '@expo/vector-icons';

// const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage) => {

//     const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

//     ItemName = ItemName.trim();
//     ItemCategory = ItemCategory.trim();
//     ItemDesc = ItemDesc.trim();
//     ItemPrice = ItemPrice.trim();

//     set(ref(database, `admin/items/${ItemCategory}/` + id), {
//         ItemId: id,
//         ItemName: ItemName,
//         ItemPrice: ItemPrice,
//         ItemDesc: ItemDesc,
//         ItemImage: ItemImage,
//         ItemCategory: ItemCategory,
//         ItemAddedDate: new Date().toLocaleString(),
//     });

// };

// const AddItem = ({ navigation }) => {
//     const [ItemName, setItemName] = useState("");
//     const [ItemDesc, setItemDesc] = useState("");
//     const [ItemCategory, setItemCategory] = useState("");
//     const [ItemPrice, setItemPrice] = useState("");
//     const [ItemImage, setItemImage] = useState("");
//     const [errortext, setErrortext] = useState("");

//     const ItemNameref = createRef();
//     const ItemDescref = createRef();
//     const ItemPriceref = createRef();
//     const ItemImageref = createRef();
//     const ItemCategoryref = createRef();

// // This function is triggered when the "Select an image" button pressed
// const showImagePicker = async () => {
//     // Ask the user for the permission to access the media library 
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//         alert("You've refused to allow this appp to access your photos!");
//         return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync();

//     if (!result['canceled']) {
//         setItemImage(result['assets'][0]["uri"]);
//     }
// }

// // This function is triggered when the "Open camera" button pressed
// const openCamera = async () => {
//     // Ask the user for the permission to access the camera
//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (permissionResult.granted === false) {
//         alert("You've refused to allow this appp to access your camera!");
//         return;
//     }

//     const result = await ImagePicker.launchCameraAsync();

//     if (!result['canceled']) {
//         setItemImage(result['assets'][0]["uri"]);
//     }
// }

// const handleSubmitButton = async () => {
//     setErrortext("");

//     if (!ItemName) return alert("Please enter Item Name.");
//     if (!ItemPrice) return alert("Please enter Item Price per Plate.");
//     if (!ItemCategory) return alert("Please enter Item Category.");
//     if (!ItemImage) return alert("Please upload Item Image.");

//     try {
//         await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage);
//         alert(`${ItemName} ${ItemDesc} - ${ItemPrice} rs has been added to ${ItemCategory} Category Successfully.`);
        // ItemDescref.current.clear();
        // ItemPriceref.current.clear();
        // ItemCategoryref.current.clear();
        // ItemNameref.current.clear();
        // setItemImage('');
        // setItemName('');
        // setItemDesc('');
        // setItemCategory('');
        // setItemPrice('');
//     }
//     catch (e) {
//         setErrortext(e)
//     }
// };

//     return (
//         <SafeAreaView
//             style={{
//                 flex: 1,
//                 backgroundColor: "#307ecc",
//             }}
//         >
//             <ScrollView
//                 keyboardShouldPersistTaps="handled"
//                 contentContainerStyle={{
//                     flex: 1,
//                 }}
//             >
//                 <KeyboardAvoidingView enabled>
//                     <View style={styles.sectionStyle}>
//                         <TextInput
//                             style={styles.inputStyle}
//                             onChangeText={(ItemName) =>
//                                 setItemName(ItemName)
//                             }
//                             underlineColorAndroid="#f000"
//                             placeholder="Enter Item Name e.g Idli/Dosa"
//                             placeholderTextColor="#8b9cb5"
//                             keyboardType="default"
//                             autoCapitalize="sentences"
//                             returnKeyType="next"
//                             blurOnSubmit={false}
//                             ref={ItemNameref}
//                         />
//                     </View>
//                     <View style={styles.sectionStyle}>
//                         <TextInput
//                             style={styles.inputStyle}
//                             onChangeText={(ItemDesc) =>
//                                 setItemDesc(ItemDesc)
//                             }
//                             underlineColorAndroid="#f000"
//                             placeholder="Enter Item Description"
//                             placeholderTextColor="#8b9cb5"
//                             keyboardType="default"
//                             returnKeyType="next"
//                             blurOnSubmit={false}
//                             ref={ItemDescref}
//                         />
//                     </View>
//                     <View style={styles.sectionStyle}>
//                         <TextInput
//                             style={styles.inputStyle}
//                             onChangeText={(ItemCategory) =>
//                                 setItemCategory(ItemCategory)
//                             }
//                             underlineColorAndroid="#f000"
//                             placeholder="Enter Item Category e.g Breakfast,Snacks..."
//                             placeholderTextColor="#8b9cb5"
//                             keyboardType="default"
//                             returnKeyType="next"
//                             blurOnSubmit={false}
//                             ref={ItemCategoryref}
//                         />
//                     </View>
//                     <View style={styles.sectionStyle}>
//                         <TextInput
//                             style={styles.inputStyle}
//                             onChangeText={(ItemPrice) =>
//                                 setItemPrice(ItemPrice)
//                             }
//                             underlineColorAndroid="#f000"
//                             placeholder="Enter Item Price Per Plate"
//                             placeholderTextColor="#8b9cb5"
//                             returnKeyType="next"
//                             keyboardType="number-pad"
//                             onSubmitEditing={Keyboard.dismiss}
//                             blurOnSubmit={false}
//                             ref={ItemPriceref}
//                         />
//                     </View>

// <View style={styles.imageContainer}>
//     {
//         ItemImage !== '' && <Image
//             source={{ uri: ItemImage }}
//             style={styles.image}
//         />
//     }
// </View>

// <View style={{
//     flexDirection: 'row',
//     justifyContent: 'space-between',
// }}>
//     <View style={{ paddingLeft: '28%', paddingTop: '2%' }}>
//         <Feather name="image" size={30} color="black" onPress={
//             showImagePicker
//             } />
//     </View>
//     <View style={{ paddingRight: '0%', paddingTop: '2%' }}>
//         <Feather name="camera" size={30} color="black" onPress={
//             openCamera} />
//     </View>

//     <View style={{ paddingRight: '30%', paddingTop: '2%' }}>
//         <AntDesign name="delete" size={30} color="black" onPress={() => {
//             setItemImage('');
//         }} />
//     </View>

// </View>

//                     {errortext != "" ? (
//                         <Text style={styles.errorTextStyle}>
//                             {" "}
//                             {errortext}{" "}
//                         </Text>
//                     ) : null}
//                     <TouchableOpacity
//                         style={styles.buttonStyle}
//                         activeOpacity={0.5}
//                         onPress={handleSubmitButton}
//                     >
//                         <Text style={styles.buttonTextStyle}>
//                             Add Item
//                         </Text>
//                     </TouchableOpacity>
//                 </KeyboardAvoidingView>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };
// export default AddItem;

// const styles = StyleSheet.create({
//     sectionStyle: {
//         flexDirection: "row",
//         height: 40,
//         marginTop: 20,
//         marginLeft: 35,
//         marginRight: 35,
//         margin: 10,
//     },
//     buttonStyle: {
//         backgroundColor: "#7DE24E",
//         borderWidth: 0,
//         color: "#FFFFFF",
//         borderColor: "#7DE24E",
//         height: 40,
//         alignItems: "center",
//         borderRadius: 30,
//         marginLeft: 35,
//         marginRight: 35,
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     buttonTextStyle: {
//         color: "#FFFFFF",
//         paddingVertical: 10,
//         fontSize: 16,
//     },
//     inputStyle: {
//         flex: 1,
//         color: "white",
//         paddingLeft: 15,
//         paddingRight: 15,
//         borderWidth: 1,
//         borderRadius: 30,
//         borderColor: "#dadae8",
//     },
//     errorTextStyle: {
//         color: "red",
//         textAlign: "center",
//         fontSize: 14,
//     },
//     imageContainer: {
//         paddingLeft: '25%'
//     },
//     image: {
//         width: '70%',
//         height: 150,
//         resizeMode: 'contain'
//     }
// });




import React, { useState, useEffect, createRef } from 'react';
import {
    Text,
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Pressable,
    Image,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { app, auth, db, database } from "../Firebase";
import { ref, set } from "firebase/database";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native';

import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';

import * as ImagePicker from 'expo-image-picker';

import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';

const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage) => {

    const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

    ItemName = ItemName.trim();
    ItemCategory = ItemCategory.trim();
    ItemDesc = ItemDesc.trim();
    ItemPrice = ItemPrice.trim();

    set(ref(database, `admin/items/${ItemCategory}/` + id), {
        ItemId: id,
        ItemName: ItemName,
        ItemPrice: ItemPrice,
        ItemDesc: ItemDesc,
        ItemImage: ItemImage,
        ItemCategory: ItemCategory,
        ItemAddedDate: new Date().toLocaleString(),
    });

};

const AddItem = ({ navigation }) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");

    const [message, showMessage] = useState();


    const ItemNameref = createRef();
    const ItemDescref = createRef();
    const ItemPriceref = createRef();
    const ItemCategoryref = createRef();


    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result['canceled']) {
            setItemImage(result['assets'][0]["uri"]);
        }
    }

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result['canceled']) {
            setItemImage(result['assets'][0]["uri"]);
        }
    }

    const handleSubmitButton = async () => {
        showMessage("");

        if (!ItemName) return alert("Please enter Item Name.");
        if (!ItemPrice) return alert("Please enter Item Price per Plate.");
        if (!ItemCategory) return alert("Please enter Item Category.");
        if (!ItemImage) return alert("Please upload Item Image.");

        try {
            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage);
            alert(`${ItemName} ${ItemDesc} - ${ItemPrice} rs has been added to ${ItemCategory} Category Successfully.`);
            ItemDescref.current.clear();
            ItemPriceref.current.clear();
            ItemCategoryref.current.clear();
            ItemNameref.current.clear();
            setItemImage('');
            setItemName('');
            setItemDesc('');
            setItemCategory('');
            setItemPrice('');
        }
        catch (e) {
            showMessage(e)
        }
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
                    <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item name</Text>
                    <TextInput
                        style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                        placeholder="Enter item name e.g Idli/Dosa"
                        autoFocus
                        keyboardType="default"
                        cursorColor='#778899'
                        ref={ItemNameref}
                        onChangeText={(ItemName) => {
                            setItemName(ItemName)
                        }}
                    />
                    <View style={{
                        borderTopWidth: scale(0.5)
                    }}>
                        <Text style={{
                            marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
                        }}>Item description</Text>
                        <TextInput
                            style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                            placeholder="Enter item description"
                            keyboardType="default"
                            cursorColor='#778899'
                            ref={ItemDescref}
                            onChangeText={(ItemDesc) => {
                                setItemDesc(ItemDesc)
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
                    <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item category</Text>
                    <TextInput
                        style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                        placeholder="Enter item category e.g Breakfast,Snacks..."
                        keyboardType="default"
                        cursorColor='#778899'
                        ref={ItemCategoryref}
                        onChangeText={(ItemCategory) => {
                            setItemCategory(ItemCategory)
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
                    <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>
                        Item price
                    </Text>
                    <TextInput
                        style={{ marginLeft: scale(10), marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: 'sans-serif-light' }}
                        placeholder="Enter item price per plate"
                        autoCompleteType="tel"
                        cursorColor='#778899'
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        ref={ItemPriceref}
                        onChangeText={(ItemPrice) => {
                            setItemPrice(ItemPrice)
                        }}
                    />
                </View>


                <View
                    style={{
                        borderWidth: scale(0.5),
                        borderRadius: scale(5),
                        marginTop: verticalScale(10),
                        paddingBottom: scale(2),
                    }}
                >
                    <Text style={{ marginLeft: scale(10), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item Image</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                        {
                            ItemImage !== '' && <Image
                                source={{ uri: ItemImage }}
                                style={styles.image}
                            />
                        }
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginVertical: verticalScale(5),
                    }}>
                        <View
                        // style={{ paddingLeft: scale(80), paddingTop: verticalScale(5) }}
                        >
                            <Feather name="image" size={scale(25)} color="black" onPress={
                                showImagePicker
                            } />
                            {/* <MaterialIcons name="add-photo-alternate" size={scale(25)} color="black" onPress={
                                showImagePicker
                            } /> */}
                        </View>
                        <View
                        // style={{ paddingRight: scale(10), paddingTop: verticalScale(5) }}
                        >
                            <Feather name="camera" size={scale(25)} color="black" onPress={
                                openCamera} />
                        </View>

                        {ItemImage ? <View
                        // style={{ paddingRight: scale(90), paddingTop: verticalScale(5)  }}
                        >
                            <AntDesign name="delete" size={scale(25)} color="black" onPress={() => {
                                setItemImage('');
                            }} />
                        </View> : <></>}

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
                    <Pressable style={styles.button} onPress={handleSubmitButton}>
                        <Text style={styles.text}>Add Item</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}


export default AddItem;


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
    image: {
        // borderRadius: scale(8),
        // borderWidth: scale(1),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        width: scale(150),
        height: verticalScale(120),
        resizeMode: 'cover'
    },
});