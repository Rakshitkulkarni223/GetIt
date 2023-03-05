
import React, { createRef, useEffect, useState } from "react";
import {
    StyleSheet, Image, SafeAreaView,
    TextInput,
    View,
    Text,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";

import { AntDesign, Feather } from '@expo/vector-icons';


import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';

import * as ImagePicker from 'expo-image-picker';

import { app, auth, db, storage, database } from "../Firebase";
import { ref, set, update } from "firebase/database";
import ViewItems from "./ViewItems";
import ActivityIndicatorElement from "../ActivityIndicatorElement";

import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";



const UpdateItem = ({ title, description, image_url, price, category, id }) => {

    const [ItemName, setItemName] = useState(title);
    const [ItemDesc, setItemDesc] = useState(description);
    const [ItemCategory, setItemCategory] = useState(category);
    const [ItemPrice, setItemPrice] = useState(price);
    const [ItemImage, setItemImage] = useState(image_url);
    const [ItemId, setItemId] = useState(id);

    const [message, setMessage] = useState();

    const ItemNameref = createRef("");
    const ItemDescref = createRef("");
    const ItemPriceref = createRef("");
    const ItemCategoryref = createRef("");


    const [loading, setloading] = useState(false);

    const [updated, setupdated] = useState(false);

    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {

        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        setloading(true)

        if (permissionResult.granted === false) {
            setloading(false)
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result['canceled']) {
            setloading(false)

            setItemImage(result['assets'][0]["uri"]);
        }

    }

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {

        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        setloading(true)

        if (permissionResult.granted === false) {
            setloading(false)
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result['canceled']) {
            setloading(false)
            setItemImage(result['assets'][0]["uri"]);
        }
    }

    const uploadImage = async (image, id) => {
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
            return url;
        }
        catch (error) {
            // console.log(error)
            setloading(false)
            Alert.alert("Image Not Uploaded!!");
        }

    }
    const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, updated) => {

        const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

        ItemName = ItemName.trim();
        ItemCategory = ItemCategory.trim();
        ItemDesc = ItemDesc.trim();
        ItemPrice = ItemPrice.trim();

        var image = await uploadImage(ItemImage, id);

        updated ?

            update(ref(database, `admin/items/${ItemCategory}/` + id), {
                ItemId: id,
                ItemName: ItemName,
                ItemPrice: ItemPrice,
                ItemDesc: ItemDesc,
                ItemImage: image,
                ItemCategory: ItemCategory,
                ItemUpdatedDate: new Date().toLocaleString(),
            }) :

            update(ref(database, `admin/items/${ItemCategory}/` + id), {
                ItemId: id,
                ItemName: ItemName,
                ItemPrice: ItemPrice,
                ItemDesc: ItemDesc,
                ItemImage: image,
                ItemCategory: ItemCategory,
                ItemAddedDate: new Date().toLocaleString(),
            })

    };

    const handleSubmitButton = async () => {

        setMessage();

        if (!ItemName) return Alert.alert("Item Name","Please enter Item Name.");
        if (!ItemPrice) return Alert.alert("Item Price","Please enter Item Price per Plate.");
        if (!ItemCategory) return Alert.alert("Item Category","Please enter Item Category.");
        if (!ItemImage) return Alert.alert("Item Image","Please upload Item Image.");

        setloading(true);


        try {
            ItemCategory.trim() !== category ?
                set(ref(database, `admin/items/${category}/` + ItemId), {

                }) : false

            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, ItemCategory.trim() === category)
            setloading(false)

            setMessage({
                text: 'Item Updated',
                type: 'info'
            })
            setloading(false);
            Alert.alert("Item Updated", `${ItemName} ${ItemDesc} - ${ItemPrice} rs has been updated to ${ItemCategory} Category Successfully.`);
            setupdated(true);
        }
        catch (e) {
            setloading(false)
            setMessage({text : e, type : 'danger'});
        }
    };


    return (
        <>
            <ActivityIndicatorElement loading={loading} />
            {
                updated ? <ViewItems /> :
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#DCDCDE' }}>
                        <ScrollView>
                            <View style={{ padding: scale(18), marginTop: verticalScale(20) }}>
                                <View
                                    style={{
                                        borderBottomWidth: scale(0.5),
                                        borderRadius: scale(5),
                                        marginTop: verticalScale(10),
                                        borderColor: '#000'
                                    }}
                                >
                                    <Text style={{ marginLeft: scale(10), color: '#27327C', marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item name</Text>
                                    <TextInput
                                        style={{ marginLeft: scale(10), color: '#000', marginBottom: verticalScale(5), fontSize: normalize(14), fontFamily: ItemName ? 'sans-serif-light' : 'sans-serif-thin' }}
                                        placeholder="Enter item name e.g Idli/Dosa"
                                        defaultValue={ItemName}
                                        placeholderTextColor='#000'
                                        keyboardType="default"
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
                                            borderColor: '#000'
                                        }}
                                    >
                                        <Text style={{
                                            marginLeft: scale(10), color: '#27327C', marginTop: verticalScale(5), fontFamily: 'sans-serif-light'
                                        }}>Item description</Text>
                                        <TextInput
                                            style={{
                                                marginLeft: scale(10), color: '#000', marginBottom: verticalScale(5), fontSize: normalize(14),
                                                fontFamily: ItemDesc ? 'sans-serif-light' : 'sans-serif-thin'
                                            }}
                                            placeholder="Enter item description"
                                            keyboardType="default"
                                            placeholderTextColor='#000'
                                            defaultValue={ItemDesc}
                                            ref={ItemDescref}
                                            clearButtonMode="always"
                                            returnKeyType="next"
                                            onSubmitEditing={() =>
                                                ItemCategory.current && ItemCategory.current.focus()
                                            }
                                            blurOnSubmit={false}
                                            cursorColor='#778899'
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
                                        borderColor: '#000'
                                    }}
                                >
                                    <Text style={{ marginLeft: scale(10), color: '#27327C', marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item category</Text>
                                    <TextInput
                                        style={{
                                            marginLeft: scale(10), color: '#000', marginBottom: verticalScale(5), fontSize: normalize(14),
                                            fontFamily: ItemCategory ? 'sans-serif-light' : 'sans-serif-thin'
                                        }}
                                        placeholder="Enter item category e.g Breakfast,Snacks..."
                                        keyboardType="default"
                                        placeholderTextColor='#000'
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
                                        borderColor: '#000'
                                    }}
                                >
                                    <Text style={{ marginLeft: scale(10), color: '#27327C', marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>
                                        Item price
                                    </Text>
                                    <TextInput
                                        style={{
                                            marginLeft: scale(10), color: '#000', marginBottom: verticalScale(5), fontSize: normalize(14),
                                            fontFamily: ItemPrice ? 'sans-serif-light' : 'sans-serif-thin'
                                        }}
                                        placeholder="Enter item price per plate"
                                        autoCompleteType="tel"
                                        cursorColor='#778899'
                                        placeholderTextColor='#000'
                                        keyboardType="phone-pad"
                                        defaultValue={ItemPrice}
                                        ref={ItemPriceref}
                                        returnKeyType="next"
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                        textContentType="telephoneNumber"
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
                                        borderColor: '#000'
                                    }}
                                >
                                    <Text style={{ marginLeft: scale(10), color: '#27327C', marginTop: verticalScale(5), fontFamily: 'sans-serif-light' }}>Item Image</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}>
                                        {
                                            ItemImage !== '' && <Image
                                                source={{ uri: ItemImage }}
                                                style={styles.image}
                                                onLoadStart={()=>{
                                                    setloading(true)
                                                }}
                                                onLoadEnd={()=>{
                                                    setloading(false)
                                                }}
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
                                            <Feather name="image" size={scale(25)} color="#000" onPress={
                                                showImagePicker
                                            } />
                                            {/* <MaterialIcons name="add-photo-alternate" size={scale(25)} color="black" onPress={
                                    showImagePicker
                                } /> */}
                                        </View>
                                        <View
                                        // style={{ paddingRight: scale(10), paddingTop: verticalScale(5) }}
                                        >
                                            <Feather name="camera" size={scale(25)} color="#000" onPress={
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
                                        {message.text}
                                    </Text>
                                ) : undefined}
                                <View style={{
                                    marginTop: verticalScale(30),
                                }}>
                                    <Pressable style={styles.button} onPress={handleSubmitButton}>
                                        <Text style={styles.text}>Update Item</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
            }
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(32),
        borderRadius: scale(4),
        elevation: scale(4),
        borderWidth: scale(0.5),
        backgroundColor: '#43B69F',
    },
    text: {
        fontSize: normalize(16),
        lineHeight: verticalScale(20),
        fontWeight: '600',
        letterSpacing: scale(0.5),
        color: '#fff',
    },
    image: {
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        width: scale(150),
        height: verticalScale(120),
        resizeMode: 'cover'
    },
});

export default UpdateItem;