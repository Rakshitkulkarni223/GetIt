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
    Alert,
    ActivityIndicator,
    Modal,
    Keyboard,
    ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { app, auth, db, storage, database } from "../Firebase";
import { ref, set } from "firebase/database";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native';

import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';

import * as ImagePicker from 'expo-image-picker';

import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import ActivityIndicatorElement from '../ActivityIndicatorElement';

import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";



const AddItem = ({ navigation }) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");

    const [message, showMessage] = useState("");


    const ItemNameref = createRef("");
    const ItemDescref = createRef("");
    const ItemPriceref = createRef("");
    const ItemCategoryref = createRef("");

    const [loading, setloading] = useState(false);


    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {

        setloading(true)
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            setloading(false)
            Alert.alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result['canceled']) {
            setItemImage(result['assets'][0]["uri"]);
        }

        setloading(false)
    }

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {

        setloading(true)
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            setloading(false)
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result['canceled']) {
            setItemImage(result['assets'][0]["uri"]);
        }

        setloading(false)
    }

    const uploadImage = async (image, id) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
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
            return url;
        }
        catch (error) {
            setloading(false)
            Alert.alert("Image Not Uploaded!!");
        }

    }

    const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage) => {

        try {
            setloading(true)
            const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

            ItemName = ItemName.trim();
            ItemCategory = ItemCategory.trim();
            ItemDesc = ItemDesc.trim();
            ItemPrice = ItemPrice.trim();

            var image = await uploadImage(ItemImage, id);

            set(ref(database, `admin/items/${ItemCategory}/` + id), {
                ItemId: id,
                ItemName: ItemName,
                ItemPrice: ItemPrice,
                ItemDesc: ItemDesc,
                ItemImage: image,
                ItemCategory: ItemCategory,
                ItemAddedDate: new Date().toLocaleString(),
            });

            setloading(false)
        }
        catch (error) {
            setloading(false)
        }

    };

    const handleSubmitButton = async () => {
        showMessage("");

        if (!ItemName) return alert("Please enter Item Name.");
        if (!ItemPrice) return alert("Please enter Item Price per Plate.");
        if (!ItemCategory) return alert("Please enter Item Category.");
        if (!ItemImage) return alert("Please upload Item Image.");

        setloading(true)

        try {

            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage);
            setloading(false)

            Alert.alert('Item Added', `${ItemName} ${ItemDesc} - ${ItemPrice} rs has been added to ${ItemCategory} Category Successfully.`);

            setItemImage('');
            setItemName('');
            setItemDesc('');
            setItemCategory('');
            setItemPrice('');

            navigation.navigate("View Items")

        }
        catch (e) {
            setloading(false)
            showMessage(e)
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3B3636' }}>
            <ScrollView>
                <ActivityIndicatorElement loading={loading} />
                <View style={{ padding: scale(18), marginTop: verticalScale(20) }}>
                    <View
                        style={{
                            borderBottomWidth: scale(0.5),
                            borderRadius: scale(5),
                            marginTop: verticalScale(10),
                            borderColor: 'white'
                        }}
                    >
                        <Text style={{ marginLeft: scale(10),fontSize : normalize(13),  marginTop: verticalScale(5), fontFamily: 'sans-serif-light', color: '#28E68A' }}>Item name</Text>
                        <TextInput
                            style={{ marginLeft: scale(10), color: 'white', marginBottom: verticalScale(5), fontSize: normalize(14), 
                            fontFamily: ItemName ? 'sans-serif-light' : 'sans-serif-thin' }}
                            placeholder="Enter item name e.g Idli/Dosa"
                            keyboardType="default"
                            defaultValue={ItemName}
                            placeholderTextColor='white'
                            cursorColor='#778899'
                            ref={ItemNameref}
                            clearButtonMode="always"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                ItemDescref.current && ItemDescref.current.focus()
                            }
                            blurOnSubmit={false}
                            onChangeText={(ItemName) => {
                                setItemName(ItemName)
                            }}
                        />
                    </View>
                    <View
                        style={{

                            borderBottomWidth: scale(0.5),
                            borderRadius: scale(5),
                            marginTop: verticalScale(10),
                            borderColor: 'white'
                        }}
                    >
                        <Text style={{
                            marginLeft: scale(10),
                            marginTop: verticalScale(5),
                            fontFamily: 'sans-serif-light',
                            color: '#28E68A',
                            fontSize : normalize(13), 
                        }}>Item description</Text>
                        <TextInput
                            style={{ marginLeft: scale(10), color: 'white', marginBottom: verticalScale(5), fontSize: normalize(14), 
                            fontFamily: ItemDesc ? 'sans-serif-light' : 'sans-serif-thin' 
                        }}
                            placeholder="Enter item description"
                            keyboardType="default"
                            placeholderTextColor='white'
                            cursorColor='#778899'
                            defaultValue={ItemDesc}
                            ref={ItemDescref}
                            clearButtonMode="always"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                ItemCategory.current && ItemCategory.current.focus()
                            }
                            blurOnSubmit={false}
                            onChangeText={(ItemDesc) => {
                                setItemDesc(ItemDesc)
                            }}
                        />
                    </View>

                    <View
                        style={{

                            borderBottomWidth: scale(0.5),
                            borderRadius: scale(5),
                            marginTop: verticalScale(10),
                            borderColor: 'white'
                        }}
                    >
                        <Text style={{ marginLeft: scale(10), color: '#28E68A',fontSize : normalize(13),  marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item category</Text>
                        <TextInput
                            style={{ marginLeft: scale(10), color: 'white', marginBottom: verticalScale(5), fontSize: normalize(14),
                             fontFamily: ItemCategory ? 'sans-serif-light' : 'sans-serif-thin'  }}
                            placeholder="Enter item category e.g Breakfast,Snacks..."
                            keyboardType="default"
                            placeholderTextColor='white'
                            cursorColor='#778899'
                            defaultValue={ItemCategory}
                            ref={ItemCategoryref}
                            returnKeyType="next"
                            clearButtonMode="always"
                            onSubmitEditing={() =>
                                ItemPrice.current && ItemPrice.current.focus()
                            }
                            blurOnSubmit={false}
                            onChangeText={(ItemCategory) => {
                                setItemCategory(ItemCategory)
                            }}
                        />
                    </View>

                    <View
                        style={{
                            borderBottomWidth: scale(0.5),
                            borderRadius: scale(5),
                            marginTop: verticalScale(10),
                            borderColor: 'white'
                        }}
                    >
                        <Text style={{ marginLeft: scale(10), color: '#28E68A',fontSize : normalize(13), marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>
                            Item price
                        </Text>
                        <TextInput
                            style={{ marginLeft: scale(10), color: 'white', marginBottom: verticalScale(5), fontSize: normalize(14), 
                            fontFamily: ItemPrice ? 'sans-serif-light' : 'sans-serif-thin'  }}
                            placeholder="Enter item price per plate"
                            autoCompleteType="tel"
                            cursorColor='#778899'
                            keyboardType="phone-pad"
                            clearButtonMode="always"
                            defaultValue={ItemPrice}
                            placeholderTextColor='white'
                            textContentType="telephoneNumber"
                            ref={ItemPriceref}
                            returnKeyType="next"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            onChangeText={(ItemPrice) => {
                                setItemPrice(ItemPrice)
                            }}
                        />
                    </View>


                    <View
                        style={{
                            borderBottomWidth: scale(0.5),
                            borderRadius: scale(5),
                            marginTop: verticalScale(10),
                            paddingBottom: scale(2),
                            borderColor: 'white'
                        }}
                    >
                        <Text style={{ marginLeft: scale(10), fontSize : normalize(13), marginTop: verticalScale(5), fontFamily: 'sans-serif-light', color: '#28E68A' }}>Item Image</Text>
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
                                <Feather name="image" size={scale(25)} color="white" onPress={
                                    showImagePicker
                                } />
                                {/* <MaterialIcons name="add-photo-alternate" size={scale(25)} color="black" onPress={
                                showImagePicker
                            } /> */}
                            </View>
                            <View
                            // style={{ paddingRight: scale(10), paddingTop: verticalScale(5) }}
                            >
                                <Feather name="camera" size={scale(25)} color="white" onPress={
                                    openCamera} />
                            </View>

                            {ItemImage ? <View
                            // style={{ paddingRight: scale(90), paddingTop: verticalScale(5)  }}
                            >
                                <AntDesign name="delete" size={scale(25)} color="red" onPress={() => {
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
                        marginTop: verticalScale(40),
                    }}>
                        <Pressable style={styles.button} onPress={handleSubmitButton}>
                            <Text style={styles.text}>Add Item</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: '#6A89B1',
    },
    text: {
        fontSize: normalize(16),
        lineHeight: verticalScale(20),
        fontWeight: '700',
        letterSpacing: scale(0.5),
        color: 'white',
    },
    image: {
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        width: scale(150),
        height: verticalScale(120),
        resizeMode: 'cover'
    },
});