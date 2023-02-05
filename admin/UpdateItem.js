
import React, { useEffect, useState } from "react";
import {
    StyleSheet, Image, SafeAreaView,
    TextInput,
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { AntDesign, Feather } from '@expo/vector-icons';


import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';

import * as ImagePicker from 'expo-image-picker';

import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";
import ViewItems from "./ViewItems";

const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, updated) => {

    const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

    ItemName = ItemName.trim();
    ItemCategory = ItemCategory.trim();
    ItemDesc = ItemDesc.trim();
    ItemPrice = ItemPrice.trim();

    updated ?

        update(ref(database, `admin/items/${ItemCategory}/` + id), {
            ItemId: id,
            ItemName: ItemName,
            ItemPrice: ItemPrice,
            ItemDesc: ItemDesc,
            ItemImage: ItemImage,
            ItemCategory: ItemCategory,
            ItemUpdatedDate: new Date().toLocaleString(),
        }) :

        update(ref(database, `admin/items/${ItemCategory}/` + id), {
            ItemId: id,
            ItemName: ItemName,
            ItemPrice: ItemPrice,
            ItemDesc: ItemDesc,
            ItemImage: ItemImage,
            ItemCategory: ItemCategory,
            ItemAddedDate: new Date().toLocaleString(),
        })

};

const UpdateItem = ({ title, description, image_url, price, category, id }) => {

    const [ItemName, setItemName] = useState(title);
    const [ItemDesc, setItemDesc] = useState(description);
    const [ItemCategory, setItemCategory] = useState(category);
    const [ItemPrice, setItemPrice] = useState(price);
    const [ItemImage, setItemImage] = useState(image_url);
    const [ItemId, setItemId] = useState(id);
    
    const [message, showMessage] = useState();

    const [updated, setupdated] = useState(false);

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

            ItemCategory.trim() !== category ?
                set(ref(database, `admin/items/${category}/` + ItemId), {

                }) : false

            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, ItemCategory.trim() === category)
            alert(`${ItemName} ${ItemDesc} - ${ItemPrice} rs has been updated to ${ItemCategory} Category Successfully.`);
            setupdated(true);
        }
        catch (e) {
            showMessage(e);
        }
    };


    return (
        <>
            {updated ? <ViewItems /> :
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
                                defaultValue={ItemName}
                                keyboardType="default"
                                cursorColor='#778899'
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
                                    defaultValue={ItemDesc}
                                    cursorColor='#778899'
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
                                defaultValue={ItemCategory}
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
                                defaultValue={ItemPrice}
                                textContentType="telephoneNumber"
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
                                <Text style={styles.text}>Update Item</Text>
                            </Pressable>
                        </View>
                    </View>
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
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        width: scale(150),
        height: verticalScale(120),
        resizeMode: 'cover'
    },
});

export default UpdateItem;