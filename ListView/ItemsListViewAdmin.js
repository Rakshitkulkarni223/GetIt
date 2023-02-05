import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set } from "firebase/database";

import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';


const Item = ({ setItemId, setupdate, setItemCategory, setItemName, setItemImage, setItemDesc, setItemPrice, id, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: normalize(13),
        fontWeight: "bold",
        paddingRight: scale(15),
        marginLeft: scale(15),
        marginTop: scale(10),
        color: 'black',
        letterSpacing: scale(0.5),
    }}>{category.toUpperCase()}</Text> : <></>}
        <View style={styles.container}>
            <View style={{ 
                flex: 1,
                flexDirection: 'column', 
                justifyContent: 'space-between',
                }}>
                <View>
                    <Text style={styles.title_item}>
                        {title.toUpperCase()}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
                <View
                >
                    <AntDesign name="edit" size={scale(20)} color="black" onPress={(e) => {
                        setItemName(title);
                        setItemDesc(description);
                        setItemImage(image_url);
                        setItemPrice(price);
                        setItemCategory(category);
                        setItemId(id);
                        setupdate(true);
                    }} />
                </View>
            </View>

            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center',justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.title_price}>
                        {price}/-
                    </Text>
                </View>
                <View
                // style={styles.container_update}
                >
                    <MaterialCommunityIcons name="delete" size={scale(22)} color="red" onPress={async () => {
                        set(ref(database, `admin/items/${category}/` + id), {
                        });
                    }} />
                </View>
            </View>
            <View>
                <Image source={{ uri: image_url }} style={styles.photo} />
            </View>
        </View>
    </>
);

const ItemsListViewAdmin = ({ DATA }) => {

    const [update, setupdate] = useState(false);

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");

    const renderItem = ({ item }) => (
        <Item
            id={item.key}
            displaycategory={item.displaycategory}
            setupdate={setupdate}
            title={item.ItemName}
            image_url={item.ItemImage}
            description={item.ItemDesc}
            price={item.ItemPrice}
            category={item.ItemCategory}
            setItemName={setItemName}
            setItemDesc={setItemDesc}
            setItemImage={setItemImage}
            setItemPrice={setItemPrice}
            setItemCategory={setItemCategory}
            setItemId={setItemId}
        />
    );

    return (
        <>
            {update ?
                <UpdateItem title={ItemName} description={ItemDesc} image_url={ItemImage} price={ItemPrice} category={ItemCategory} id={ItemId} />
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                    />
                </SafeAreaView>
            }
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        paddingBottom: scale(15),
        marginLeft: scale(15),
        marginRight: scale(15),
        marginTop: scale(8),
        marginBottom: scale(9),
        marginVertical: verticalScale(0),
        borderRadius: scale(10),
        backgroundColor: '#ffe4e1',
        elevation: scale(5),
    },
    title_item: {
        fontSize: normalize(13),
        color: '#000',
    },
    description: {
        fontSize: normalize(10),
        fontStyle: 'italic',
    },
    title_price: {
        fontSize: normalize(15),
        color: '#000',
        // paddingTop: 40
    },
    total_item_price: {
        fontSize: normalize(20),
        color: '#000',
        paddingTop: scale(10),
    },
    container_addremove: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute'
    },
    container_add: {
        marginTop: verticalScale(-13),
        marginLeft: scale(42),
        marginVertical: verticalScale(13),
        borderRadius: scale(7),
        height: verticalScale(25),
        width: scale(78),
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: scale(1.5),
        elevation: scale(10),
    },
    photo: {
        height: verticalScale(100),
        width: scale(110),
        borderRadius: scale(9)
    },
});

export default ItemsListViewAdmin;