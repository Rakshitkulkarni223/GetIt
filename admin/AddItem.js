import React, { useState, createRef } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { app, auth, db, database } from "../Firebase";
import { ref, set } from "firebase/database";

const SaveItem = async (ItemCategory,ItemName, ItemPrice, ItemDesc, ItemImage) => {

    const id = ItemCategory.match(/([0-9a-zA-Z])/g).join("") + ItemName.match(/([0-9a-zA-Z])/g).join("") + ItemDesc.match(/([0-9a-zA-Z])/g).join("")

    // console.log(id);
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
    const [errortext, setErrortext] = useState("");

    const ItemNameref = createRef();
    const ItemDescref = createRef();
    const ItemPriceref = createRef();
    const ItemImageref = createRef();
    const ItemCategoryref = createRef();

    const handleSubmitButton = async () => {
        setErrortext("");
        if (!ItemName) return alert("Please enter Item Name.");
        if (!ItemPrice) return alert("Please enter Item Price per Plate.");
        if (!ItemCategory) return alert("Please enter Item Category.");
        if (!ItemImage) return alert("Please upload Item Image.");

        try {
            await SaveItem(ItemCategory, ItemName, ItemPrice, ItemDesc, ItemImage);
            alert(`${ItemName} ${ItemDesc} - ${ItemPrice} rs has been added to ${ItemCategory} Category Successfully.`);
            ItemDescref.current.clear();
            ItemPriceref.current.clear();
            ItemImageref.current.clear();
            ItemNameref.current.clear();
            ItemCategoryref.current.clear();
        }
        catch (e) {
            setErrortext(e);
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#307ecc" }}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                <View style={{ alignItems: "center" }}>
                </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(ItemName) =>
                                setItemName(ItemName)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Item Name e.g Idli/Dosa"
                            placeholderTextColor="#8b9cb5"
                            keyboardType="default"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            ref={ItemNameref}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(ItemDesc) =>
                                setItemDesc(ItemDesc)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Item Description"
                            placeholderTextColor="#8b9cb5"
                            keyboardType="default"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            ref={ItemDescref}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(ItemCategory) =>
                                setItemCategory(ItemCategory)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Item Category e.g Breakfast,Snacks..."
                            placeholderTextColor="#8b9cb5"
                            keyboardType="default"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            ref={ItemCategoryref}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(ItemPrice) =>
                                setItemPrice(ItemPrice)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Item Price Per Plate"
                            placeholderTextColor="#8b9cb5"
                            returnKeyType="next"
                            keyboardType="number-pad"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            ref={ItemPriceref}
                        />
                    </View>

                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(ItemImage) =>
                                setItemImage(ItemImage)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Upload Item Image"
                            placeholderTextColor="#8b9cb5"
                            returnKeyType="next"
                            keyboardType="default"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            ref={ItemImageref}
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
                            Add Item
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};
export default AddItem;

const styles = StyleSheet.create({
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
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "#dadae8",
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
});