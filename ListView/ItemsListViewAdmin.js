import React, { createRef, useEffect, useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, Keyboard, KeyboardAvoidingView } from 'react-native';
import { AntDesign, Ionicons, EvilIcons ,MaterialCommunityIcons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set } from "firebase/database";

import { normalize } from '../FontResize';

import { scale, moderateScale, verticalScale } from '../Dimensions';


const Item = ({ setItemId, setupdate, setItemCategory, setItemName, setItemImage, setItemDesc, setItemPrice, id, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: normalize(13),
        fontWeight: "600",
        paddingRight: scale(15),
        marginLeft: scale(15),
        marginTop: scale(10),
        color: 'white',
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

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
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

const renderHeader = (query, DATA, setData, setQuery, searchRef) => {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                padding: scale(5),
                marginTop: verticalScale(10),
                marginHorizontal: scale(12),
                borderRadius: scale(5),
                borderColor: 'black',
                borderWidth: scale(1),
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-start'
            }}
        >
            <View>
                <Ionicons name="search" size={scale(16)} color="black" />
            </View>
            <View>
                <TextInput
                    style={{
                        // flex: 1,
                        // backgroundColor: '#fff',
                        paddingHorizontal: scale(10),
                        marginRight: scale(40),
                        // // marginLeft: scale(10),
                        // // marginBottom: verticalScale(5),
                        fontSize: normalize(12),
                        // fontFamily: 'sans-serif-light'
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    ref={searchRef}
                    onSubmitEditing={Keyboard.dismiss}
                    returnKeyType="next"
                    cursorColor='#778899'
                    clearButtonMode="always"
                    onChangeText={queryText => handleSearch(queryText, DATA, setData, setQuery)}
                    placeholder="Search Items"
                />
            </View>
            {query ?
                <View style={{
                    // flex: 1,
                    // flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    marginLeft: scale(300),
                    position: 'absolute'
                }}>
                    <Ionicons  name="close" size={scale(18)} color="black" 
                    onPress={()=>{
                        Keyboard.dismiss
                        setQuery('');
                        setData(DATA)
                        searchRef.current.clear();
                    }}/>
                </View>
                : <></>}
        </View>
    );
}

const handleSearch = (text, DATA, setData, setQuery) => {
    const formattedQuery = text.toLowerCase();
    const filteredData = DATA.filter((items) => {
        return contains(items, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
};

const contains = (items, query) => {

    if (items.ItemName.toLowerCase().includes(query) || items.ItemCategory.toLowerCase().includes(query) ||
        items.ItemDesc.toLowerCase().includes(query)) {
        return true;
    }

    return false;
};


const ItemsListViewAdmin = ({ DATA }) => {

    const [update, setupdate] = useState(false);

    const [query, setQuery] = useState('');

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");

    const searchRef = createRef();


    const [data, setData] = useState(DATA);
    useEffect(() => { setData(DATA) }, [DATA])

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
                <SafeAreaView style={{
                    flex: 1,
                    backgroundColor: '#3B3636'
                }} keyboardShouldPersistTaps="handled"
                >
                    <KeyboardAvoidingView enabled>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                        ListHeaderComponent={renderHeader(query, DATA, setData, setQuery, searchRef)}
                    />
                    </KeyboardAvoidingView>
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
        fontWeight: '600'
    },
    description: {
        fontSize: normalize(10),
        fontStyle: 'italic',
    },
    title_price: {
        fontSize: normalize(15),
        color: '#000',
        fontWeight: '600'
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