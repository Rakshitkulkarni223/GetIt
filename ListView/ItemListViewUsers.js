import React, { useState, useEffect, createRef } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert, TextInput, Keyboard, ActivityIndicator, Modal } from 'react-native';
import { AntDesign, EvilIcons, Ionicons } from '@expo/vector-icons';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";

import { scale, moderateScale, verticalScale } from '../Dimensions';

import { normalize } from '../FontResize';
import ActivityIndicatorElement from '../ActivityIndicatorElement';

const Item = ({ setloading, index, setItemId, setItemCategory, showfooter, handleIncrease, qtyhandlervisible, handleDecrease, setItemName, setItemImage, setItemDesc, setItemPrice, id, ItemQuantity, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: normalize(13),
        fontWeight: "600",
        marginLeft: scale(15),
        marginTop: scale(10),
        color: 'white',
        letterSpacing: scale(0.5),
        paddingRight: scale(15),
    }}>{category.toUpperCase()}</Text> : <></>}
        <View>

            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingRight: scale(8),
                    // alignItems: 'center',
                    // alignItems: "flex-start",
                }}>
                    <View>
                        <Text style={styles.title_item}>
                            {title.toUpperCase()}
                        </Text>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.title_price}>
                            {price}/-
                        </Text>
                    </View>
                    {ItemQuantity * price > 0 ? <View>
                        <Text style={styles.total_item_price}>
                            {ItemQuantity * price}/-
                        </Text>
                    </View>
                        : <></>}
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                }}
                >
                    <View style={{ borderWidth: scale(1), borderRadius: scale(10) }}>
                        <Image source={{ uri: image_url }} style={styles.photo}
                            onLoadStart={() => {
                                setloading(true)
                            }}
                            onLoadEnd={() => {
                                setloading(false)
                            }}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        position: 'absolute',
                        marginTop: verticalScale(115),
                        borderWidth: scale(1),
                        height: scale(23),
                        alignItems: 'center',
                        marginLeft: scale(38),
                        width: scale(80),
                        borderColor: 'black',
                        backgroundColor: 'white',
                        borderWidth: scale(0.5),
                        borderRadius: scale(5),
                        elevation: scale(10),
                    }}>
                        {(qtyhandlervisible && showfooter) ?
                            <>
                                {ItemQuantity > 0 ?
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            position: 'absolute',
                                            marginTop: verticalScale(115),
                                            borderWidth: scale(1),
                                            height: scale(23),
                                            marginLeft: scale(38),
                                            width: scale(80),
                                            borderColor: 'black',
                                            backgroundColor: 'white',
                                            borderWidth: scale(0.5),
                                            borderRadius: scale(5),
                                            elevation: scale(10),
                                        }}
                                    >
                                        <View style={{ justifyContent: 'center', flex: 1 }}
                                        >
                                            <AntDesign name="minus" size={scale(20)} color="black"
                                                onPress={() => handleDecrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </View>
                                        <View style={{ justifyContent: 'center', flex: 1 }}
                                        >
                                            <Text style={
                                                [
                                                    StyleSheet.absoluteFill,
                                                    {
                                                        fontWeight: '600',
                                                        fontSize: normalize(15),
                                                        backgroundColor: '#dcdcdc',
                                                        borderLeftWidth: scale(0.5),
                                                        borderRightWidth: scale(0.5),
                                                        color: "black",
                                                        textAlign: 'center',
                                                        textAlignVertical: 'center',
                                                    }
                                                ]
                                            }>{ItemQuantity}</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
                                        >
                                            <Ionicons name="md-add-outline" size={scale(20)} color="black"
                                                onPress={() => handleIncrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <Text style={{
                                            textAlignVertical: 'center',
                                            textAlign: 'center',
                                            color: "black",
                                            fontSize: normalize(15),
                                            fontWeight: "600"
                                        }} onPress={() => handleIncrease(index)}>ADD</Text>
                                    </View>
                                }
                            </>
                            :
                            <></>
                        }

                        {(qtyhandlervisible && !showfooter) ?
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: 'absolute',
                                marginTop: verticalScale(-12),
                                borderWidth: scale(1),
                                height: scale(23),
                                marginLeft: scale(40),
                                width: scale(80),
                                borderRadius: scale(5),
                                borderColor: 'black',
                                backgroundColor: 'white',
                                borderWidth: scale(0.5),
                                elevation: scale(10),
                            }}>
                                <Text style={{
                                    textAlignVertical: 'center',
                                    textAlign: 'center',
                                    color: "black",
                                    fontSize: normalize(15),
                                    fontWeight: "600"
                                }}>{ItemQuantity}</Text>
                            </View> : <></>}

                    </View>
                </View>
            </View>
        </View>
    </>
);

const renderHeader = (query, DATA, setData, setQuery, searchRef, setloading) => {
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
                // justifyContent: 'space-between'
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
                    onChangeText={queryText => handleSearch(queryText, DATA, setData, setQuery, setloading)}
                    placeholder="Search Items"
                />
            </View>
            {query ?
                <View style={{
                    marginLeft: scale(300),
                    position: 'absolute'
                }}>
                    <Ionicons name="close" size={scale(18)} color="black"
                        onPress={() => {
                            setloading(true)
                            setQuery('');
                            setData(DATA)
                            if (searchRef && searchRef.current) {
                                searchRef.current.clear()
                            }
                            setloading(false)
                        }} />
                </View>
                : <></>}
        </View>
    );
}

const handleSearch = (text, DATA, setData, setQuery, setloading) => {

    setloading(true)
    const formattedQuery = text.toLowerCase();
    const filteredData = DATA.filter((items) => {
        return contains(items, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
    setloading(false)
};

const contains = (items, query) => {

    if (items.ItemName.toLowerCase().includes(query) || items.ItemCategory.toLowerCase().includes(query) ||
        items.ItemDesc.toLowerCase().includes(query)) {
        return true;
    }

    return false;
};


const ItemsListViewUsers = ({ navigation, DATA, OrderId, qtyhandler, showfooter, totalamount, settotalamount, loading, setloading }) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [refresh, setRefresh] = useState('');
    const [qtyhandlervisible, setqtyhandlervisible] = useState(qtyhandler);
    // const [totalamount, settotalamount] = useState(0)
    const [query, setQuery] = useState('');

    const searchRef = createRef();


    const [data, setData] = useState(DATA);
    useEffect(() => {
        setQuery('');
        if (searchRef && searchRef.current) {
            searchRef.current.clear()
        }
        setData(DATA)
    }, [DATA])

    const handleIncrease = (index) => {

        setloading(true)

        const temp = data;
        temp[index].ItemQuantity = temp[index].ItemQuantity + 1;
        var id = temp[index].key;
        var title = temp[index].ItemName;
        var image_url = temp[index].ItemImage;
        var price = temp[index].ItemPrice;
        var description = temp[index].ItemDesc;
        var category = temp[index].ItemCategory;

        settotalamount(totalamount + parseFloat(price));

        set(ref(database, `users/orders/${OrderId}/items/${category}/` + id), {
            ItemId: id,
            ItemName: title,
            ItemPrice: price,
            ItemDesc: description,
            ItemImage: image_url,
            ItemCategory: category,
            ItemQuantity: temp[index].ItemQuantity,
            ItemAddedDate: new Date().toLocaleString(),
            OrderConfirmed: false,
            OrderPending: false,
            OrderDelivered: false
        });
        setData(temp);
        setRefresh(Math.random()); // <- Add if your view not Rerender

        setloading(false)
    };

    const handleDecrease = (index) => {

        setloading(true)

        const temp = data;
        temp[index].ItemQuantity = temp[index].ItemQuantity - 1;
        if (temp[index].ItemQuantity <= 0) {
            temp[index].ItemQuantity = 0;
        }
        var id = temp[index].key;
        var title = temp[index].ItemName;
        var image_url = temp[index].ItemImage;
        var price = temp[index].ItemPrice;
        var description = temp[index].ItemDesc;
        var category = temp[index].ItemCategory;

        settotalamount(totalamount - parseFloat(price));


        set(ref(database, `users/orders/${OrderId}/items/${category}/` + id), {
            ItemId: id,
            ItemName: title,
            ItemPrice: price,
            ItemDesc: description,
            ItemImage: image_url,
            ItemCategory: category,
            ItemQuantity: temp[index].ItemQuantity,
            ItemAddedDate: new Date().toLocaleString(),
            OrderConfirmed: false,
            OrderPending: false,
            OrderDelivered: false
        });
        setloading(false)
        setData(temp);
        setRefresh(Math.random()); // <- Add if your view not Rerender
    };

    const renderItem = ({ item, index }) => (
        <Item
            index={index}
            id={item.key}
            displaycategory={item.displaycategory}
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
            ItemQuantity={item.ItemQuantity}
            handleIncrease={handleIncrease}
            handleDecrease={handleDecrease}
            qtyhandlervisible={qtyhandlervisible}
            showfooter={showfooter}
            setloading={setloading}
        />
    );

    const checkcart = () => {

        setloading(true);

        searchRef.current.clear();
        setQuery('');
        setData(DATA);

        if (totalamount <= 0) {
            Alert.alert('No Items In Cart', `Please select atleast one item to order`, [
                {
                    text: 'OK',
                },
            ])
            setloading(false)
        }
        else {
            navigation.navigate("Confirm Order", { OrderId: OrderId })
        }
    }


    return (
        <>
            <ActivityIndicatorElement loading={loading} />

            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#3B3636'
                // backgroundColor: ''
            }}>
                {
                    DATA.length !== 0 ?
                        <SafeAreaView style={{
                            flex: 1,
                            backgroundColor: '#3B3636'
                            // backgroundColor: ''
                        }}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                ListEmptyComponent={
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: scale(15),
                                    }}>
                                        <Text style={{
                                            // padding: scale(34),
                                            fontFamily: 'sans-serif-thin',
                                            // fontWeight: '700',
                                            letterSpacing: scale(0.5),
                                            color: 'white',
                                            marginTop: verticalScale(5),

                                        }}>
                                            <Text> No results for</Text>
                                            <Text style={{ fontWeight: "bold" }}> {query}</Text>
                                        </Text>

                                    </View>
                                }
                                keyExtractor={(item, index) => String(index)}
                                ListHeaderComponent={renderHeader(query, DATA, setData, setQuery, searchRef, setloading)}
                            />


                            {showfooter ? <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                height: verticalScale(35),
                            }}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        // width: scale(200),
                                        borderColor: 'black',
                                        // backgroundColor: 'white',
                                    }}
                                ><Text style={{
                                    fontSize: normalize(15),
                                    paddingLeft: scale(8),
                                    color: 'black',
                                    fontWeight: '600'
                                }} >Total Amount : {totalamount}/-</Text></View>

                                <View
                                    style={{
                                        justifyContent: 'center',
                                        paddingLeft: scale(28),
                                        paddingRight: scale(28),
                                        borderLeftWidth: scale(1),
                                        borderBottomWidth: scale(1),
                                        borderRightWidth: scale(1),
                                        borderColor: 'black',
                                        backgroundColor: "#fa8072",
                                        borderRadius: scale(5),
                                    }}
                                ><Text style={{
                                    textAlign: 'center',
                                    fontSize: normalize(18),
                                    color: 'white',
                                    fontWeight: '600'
                                }} onPress={checkcart}>Order Now</Text></View>

                            </View> : <></>}


                            {!showfooter ? <View style={{
                                justifyContent: 'center',
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                height: verticalScale(35),
                            }}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        // width: scale(200),
                                        borderColor: 'black',
                                        // backgroundColor: 'white',
                                    }}
                                ><Text style={{
                                    fontSize: normalize(18),
                                    paddingLeft: scale(8),
                                    color: 'black',
                                    fontWeight: '600'
                                }} >Total Amount : {totalamount}/-</Text></View>
                            </View> : <></>}

                        </SafeAreaView>
                        :
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {loading ? <Text style={{
                                marginTop: scale(50),
                                // padding: scale(34),
                                fontFamily: 'sans-serif-thin',
                                fontWeight: '700',
                                letterSpacing: scale(0.5),
                                color: 'red'
                            }}>
                                Loading items...
                            </Text> :
                                <Text style={{
                                    // padding: scale(34),
                                    fontWeight: '600',
                                    letterSpacing: scale(0.5),
                                    color: 'white',
                                    fontSize: normalize(15)
                                }}>
                                    No items
                                </Text>
                            }
                        </View>
                }
            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: verticalScale(190),
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        paddingBottom: scale(25),
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
        fontWeight: "600",
    },
    title_price: {
        fontSize: normalize(13),
        color: '#000',
        // fontWeight: "600",
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
        // marginTop: verticalScale(-13),
        // marginVertical: verticalScale(13),
        borderRadius: scale(7),
        // height: verticalScale(25),
        width: scale(78),
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: scale(1.5),
        elevation: scale(10),
    },
    description: {
        fontSize: normalize(10),
        fontStyle: 'italic',
    },
    photo: {
        height: verticalScale(126),
        width: scale(144),
        borderRadius: scale(9)
    },
});

export default ItemsListViewUsers;