
import React, { useEffect, useState } from "react";
import {
    StyleSheet, Image, SafeAreaView,
    TextInput,
    View,
    Text,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";
import ViewItems from "./ViewItems";

const SaveItem = async (ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, updated) => {

    const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

    ItemName = ItemName.trim();
    ItemCategory = ItemCategory.trim();
    ItemDesc = ItemDesc.trim();
    ItemPrice = ItemPrice.trim();

    updated?

    update(ref(database, `admin/items/${ItemCategory}/` + id), {
        ItemId: id,
        ItemName: ItemName,
        ItemPrice: ItemPrice,
        ItemDesc: ItemDesc,
        ItemImage: ItemImage,
        ItemCategory: ItemCategory,
        ItemUpdatedDate : new Date().toLocaleString(),
    }) :

    update(ref(database, `admin/items/${ItemCategory}/` + id), {
        ItemId: id,
        ItemName: ItemName,
        ItemPrice: ItemPrice,
        ItemDesc: ItemDesc,
        ItemImage: ItemImage,
        ItemCategory: ItemCategory,
        ItemAddedDate : new Date().toLocaleString(),
    })

};

const UpdateItem = ({ title, description, image_url, price,category,id }) => {

    const [ItemName, setItemName] = useState(title);
    const [ItemDesc, setItemDesc] = useState(description);
    const [ItemCategory, setItemCategory] = useState(category);
    const [ItemPrice, setItemPrice] = useState(price);
    const [ItemImage, setItemImage] = useState(image_url);
    const [ItemId, setItemId] = useState(id);
    const [errortext, setErrortext] = useState("");
    const [updated, setupdated] = useState(false);

    // useEffect(()=>{
    //     // set(ref(database, `admin/items/${ItemCategory}/` + ItemId), {
    //     // });
    // },[])


    const handleSubmitButton = async () => {
        setErrortext("");
        if (!ItemName) return alert("Please enter Item Name.");
        if (!ItemPrice) return alert("Please enter Item Price per Plate.");
        if (!ItemCategory) return alert("Please enter Item Category.");
        if (!ItemImage) return alert("Please upload Item Image.");

        try {
            ItemCategory.trim()!==category?
            set(ref(database, `admin/items/${category}/` + ItemId),{
       
            }):false

            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage, ItemCategory.trim()===category)
            alert(`${ItemName} ${ItemDesc} - ${ItemPrice} rs has been updated to ${ItemCategory} Category Successfully.`);
            setupdated(true);

        }
        catch (e) {
            setErrortext(e);
        }
    };


    return (
        <>
            {updated ? <ViewItems/> :
                <SafeAreaView
                    style={styles.root}
                >
                    <View style={[styles.container, { backgroundColor: '#e1e4e8' }]}>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ItemName) =>
                                    setItemName(ItemName)
                                }
                                defaultValue={ItemName}
                                underlineColorAndroid="#f000"
                                placeholder="Enter Item Name e.g Idli/Dosa"
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                autoCapitalize="sentences"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            // ref={ItemNameref}
                            />
                        </View>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ItemDesc) =>
                                    setItemDesc(ItemDesc)
                                }
                                defaultValue={ItemDesc}
                                underlineColorAndroid="#f000"
                                placeholder="Enter Item Description"
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            // ref={ItemDescref}
                            />
                        </View>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ItemCategory) =>
                                    setItemCategory(ItemCategory)
                                }
                                defaultValue={ItemCategory}
                                underlineColorAndroid="#f000"
                                placeholder="Enter Item Category e.g Breakfast,Snacks..."
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                returnKeyType="next"
                                blurOnSubmit={false}
                            // ref={ItemCategoryref}
                            />
                        </View>
                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ItemPrice) =>
                                    setItemPrice(ItemPrice)
                                }
                                defaultValue={ItemPrice}
                                underlineColorAndroid="#f000"
                                placeholder="Enter Item Price Per Plate"
                                placeholderTextColor="#8b9cb5"
                                returnKeyType="next"
                                keyboardType="number-pad"
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                            // ref={ItemPriceref}
                            />
                        </View>

                        <View style={styles.sectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(ItemImage) =>
                                    setItemImage(ItemImage)
                                }
                                defaultValue={ItemImage}
                                underlineColorAndroid="#f000"
                                placeholder="Upload Item Image"
                                placeholderTextColor="#8b9cb5"
                                returnKeyType="next"
                                keyboardType="default"
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                            // ref={ItemImageref}
                            />
                        </View>

                        {errortext != "" ? (
                            <Text style={styles.errorTextStyle}>
                                {" "}
                                {errortext}{" "}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitButton}
                        >
                            <Text style={styles.buttonTextStyle}>
                                Update Item
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }
        </>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        height: 500,
        width: 350,
        borderRadius: 16,
        padding: 16,
        borderWidth: 8,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    item: {
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 48,
        width: 48,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        color: '#000',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    container_price: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    container_update: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    photo: {
        height: 50,
        width: 50,
    },
    sectionStyle: {
        flexDirection: "row",
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: "#7DE24E",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "#7DE24E",
        height: 40,
        alignItems: "center",
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: "black",
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "black",
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
});

export default UpdateItem