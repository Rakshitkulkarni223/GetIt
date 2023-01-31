import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set } from "firebase/database";


const Item = ({ setItemId, setupdate, setItemCategory, setItemName, setItemImage, setItemDesc, setItemPrice, id, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: 15,
        fontWeight: "bold",
        // fontStyle: 'italic'
    }}>{category}</Text> : <></>}
        <View style={styles.container}>
            <Image source={{ uri: image_url }} style={styles.photo} />
            <View style={styles.container_text}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.description}>
                    {description}
                </Text>
            </View>
            <View style={styles.container_price}>
                <Text style={styles.title}>
                    {price}/-
                </Text>
            </View>
            <View style={styles.container_update}>
                <AntDesign name="edit" size={24} color="black" onPress={(e) => {
                    setItemName(title);
                    setItemDesc(description);
                    setItemImage(image_url);
                    setItemPrice(price);
                    setItemCategory(category);
                    setItemId(id);
                    setupdate(true);
                }} />
            </View>
            <View style={styles.container_update}>
                <MaterialCommunityIcons name="delete" size={24} color="red" onPress={async () => {
                    set(ref(database, `admin/items/${category}/` + id), {
                    });
                }} />
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
                <SafeAreaView style={styles.container}>
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
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 2,
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
        resizeMode: 'contain'
    },
});

export default ItemsListViewAdmin;