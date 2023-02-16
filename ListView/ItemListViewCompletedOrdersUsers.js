import React, { createRef, useEffect, useState } from 'react';
import { SafeAreaView, Modal, View, FlatList, StyleSheet, Text, StatusBar, TextInput, Image, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";

import QRCode from 'react-native-qrcode-svg';
import GoogleMap from '../GoogleMap';


import { scale, moderateScale, verticalScale } from '../Dimensions';

import { normalize } from '../FontResize';
import ActivityIndicatorElement from '../ActivityIndicatorElement';


const Item = ({ setloading, id, OrderId, title, image_url, price, description, category, displayCategory, quantity, ItemAddedDate }) => (
    <>
        {displayCategory ? <Text style={{
            fontSize: normalize(13),
            fontWeight: "600",
            marginLeft: scale(15),
            marginTop: scale(10),
            color: '#000',
            letterSpacing: scale(0.5),
            paddingRight: scale(15),
        }}>{category.toUpperCase()}</Text> : <></>}


        <View style={styles.container}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
                <View style={{
                    alignItems: 'center'
                }}>
                    <View>
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
                        marginTop: verticalScale(5)
                    }}>
                        <Text style={styles.title_price}>
                            ₹{price}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    // marginTop: verticalScale(4),
                    justifyContent: 'center'
                }}>
                    <Text style={styles.title_item}>
                        {title.toUpperCase()}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>

            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center'
            }}>

                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={[styles.title_item, { fontWeight: '500' }]}>
                        {quantity}
                    </Text>
                </View>

            </View>

            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }}>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={[styles.title_price, { fontWeight: '600' }]}>
                        ₹{quantity * price}
                    </Text>
                </View>
            </View>
            </View>


            {/* <View style={styles.container}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
            }}>
                <View>
                <Image source={{ uri: image_url }} style={styles.photo} 
                onLoadStart={()=>{
                    setloading(true)
                }}
                onLoadEnd={()=>{
                    setloading(false)
                }}
                 />
                </View>
                <View style={{
                    marginTop: verticalScale(4),
                }}>
                    <Text style={styles.title_item}>
                        {title.toUpperCase()}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: scale(8),
                alignItems: 'center',
            }}>

                <View style={{
                    marginLeft: scale(2),
                }}>
                    <Text style={styles.title_price}>
                        {price}/-
                    </Text>
                </View>

                <View style={{
                    marginLeft: scale(2),
                }}>
                    <Text style={styles.title_item}>
                        {quantity}
                    </Text>
                </View>
            </View>
        </View> */}
        </>
    );


const renderHeader = (query, DATA, setData, setQuery, searchRef, setloading) => {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                padding: scale(3),
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
                <Ionicons name="search" size={scale(15)} color="black" />
            </View>
            <View>
                <TextInput
                    style={{
                        paddingHorizontal: scale(10),
                        marginRight: scale(40),
                        fontSize: normalize(12),
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    ref={searchRef}
                    onSubmitEditing={Keyboard.dismiss}
                    returnKeyType="next"
                    cursorColor='#778899'
                    clearButtonMode="always"
                    letterSpacing={normalize(1.5)}
                    onChangeText={queryText => handleSearch(queryText, DATA, setData, setQuery, setloading)}
                    placeholder="Search Order Id"
                />
            </View>
            {query ?
                <View style={{
                    marginLeft: scale(295),
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

    const formattedQuery = text;
    const filteredData = DATA.filter((items) => {
        return contains(items, formattedQuery);
    });

        setData(filteredData);
        setQuery(text);
        setloading(false)
};

const contains = (items, query) => {

    if (items.key.includes(query) || items.value[0].ItemName.toLowerCase().includes(query) || items.value[0].ItemCategory.toLowerCase().includes(query) ||
        items.value[0].ItemDesc.toLowerCase().includes(query)) {
        return true;
    }
        return false;
};


        const ItemListViewCompletedOrdersUsers = ({AllOrders, loading, setloading}) => {

    const [update, setupdate] = useState(false);

        const [ItemName, setItemName] = useState("");
        const [ItemDesc, setItemDesc] = useState("");
        const [ItemCategory, setItemCategory] = useState("");
        const [ItemPrice, setItemPrice] = useState("");
        const [ItemImage, setItemImage] = useState("");
        const [ItemId, setItemId] = useState("");
        const [toggle, setToggle] = useState(true);

        const searchRef = createRef();

        const [query, setQuery] = useState('');

        const [data, setData] = useState(AllOrders);

        const [displayQRCode, setdisplayQRCode] = useState(false);

        const [totalamount, settotalamount] = useState('');

        const [index, setindex] = useState("");

        const [visibleMap, setvisibleMap] = useState(false);

        const [latitude, setlatitude] = useState('');
        const [longitude, setlongitude] = useState('');

    useEffect(() => {
            setQuery('');
        if (searchRef && searchRef.current) {
            searchRef.current.clear()
        }
        setData(AllOrders)
    }, [AllOrders])

    useEffect(() => {
            setvisibleMap(false);
    }, [])

    const toggleFunction = (index) => {

            setloading(true)
        data[index].toggle = !data[index].toggle;
        setToggle(!toggle);
        setloading(false)
    };

        const renderItem = ({item, index}) => (
        <View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(10),
                padding: scale(12),
                borderWidth: scale(0.7),
                borderRadius: scale(5),
                backgroundColor: '#778899',
                elevation: scale(5),
            }}>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: normalize(14),
                            fontWeight: "600",
                            color: '#fff'
                        }}>{index + 1}. {item.key}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text
                        style={{
                            fontSize: normalize(14),
                            fontWeight: "600",
                            color: '#fff'
                        }}>{data[index].totalamount}/-</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    {
                        data[index].OrderStatus === -1 ?

                            <MaterialCommunityIcons name="clock-alert-outline" size={normalize(16)} color="black"
                                onPress={() => {
                                    Alert.alert('Order Status', 'Pending', [
                                        {
                                            text: "OK",
                                        }
                                    ])
                                }}
                            /> :

                            data[index].OrderStatus === 0 ?
                                <MaterialCommunityIcons name="clock-check-outline" size={normalize(16)} color="black" onPress={() => {
                                    Alert.alert('Order Status', 'Confirmed', [
                                        {
                                            text: "OK",
                                        }
                                    ])

                                }} />
                                : data[index].OrderStatus === 1 ?
                                    <MaterialCommunityIcons name="check-decagram" size={normalize(16)} color="#08CE65" onPress={() => {
                                        Alert.alert('Order Status', 'Delivered', [
                                            {
                                                text: "OK",
                                            }
                                        ])

                                    }} />
                                    :
                                    <MaterialCommunityIcons name="cancel" size={normalize(16)} color="#E52727" onPress={() => {
                                        Alert.alert('Order Status', 'Not Delivered (cancelled)', [
                                            {
                                                text: "OK",
                                            }
                                        ])

                                    }} />
                    }
                </View>
                <View>
                    <MaterialIcons name="location-pin" size={normalize(16)} color="#D5380D"
                        onPress={() => {


                            setloading(true)

                            if (!data[index].Longitude && !data[index].Latitude && data[index].Location !== '') {

                                setloading(false)

                                Alert.alert('Order Delivery Location', `Exact Location is not found. But Order Delivered to ${data[index].Location}`, [
                                    {
                                        text: 'OK',
                                    },
                                ])
                            }

                            if (data[index].Longitude && data[index].Latitude && data[index].Location !== '') {
                                setlongitude(data[index].Longitude);
                                setlatitude(data[index].Latitude);
                                setloading(false)

                                Alert.alert('Order Delivery Location', `${data[index].Location}`, [
                                    {
                                        text: 'OK',
                                    },
                                ])
                                // setvisibleMap(true);
                            }

                            setloading(false)

                        }
                        }
                    />
                </View>
                {/* <View>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={normalize(20)} color="green"
                        onPress={() => {
                            alert(`Order Delivered To ${data[index].Location}`);
                        }}
                    />
                </View> */}

            </View>


            {data[index].toggle ? <FlatList
                data={item.value}
                renderItem={({ item }) => (
                    <View>
                        <Item
                            id={item.key}
                            displayCategory={item.displayCategory}
                            displayUser={item.displayUser}
                            OrderID={item.OrderID}
                            title={item.ItemName}
                            image_url={item.ItemImage}
                            description={item.ItemDesc}
                            price={item.ItemPrice}
                            category={item.ItemCategory}
                            quantity={item.ItemQuantity}
                            ItemAddedDate={item.ItemAddedDate}
                            setloading={setloading}
                        />
                    </View>
                )
                }
                keyExtractor={(item, index) => String(index)}
            /> : <></>}
        </View>

        );

        return (

        <>
            <ActivityIndicatorElement loading={loading} />
            {

                visibleMap ? <GoogleMap Longitude={longitude} Latitude={latitude} setvisibleMap={setvisibleMap} /> :

                    <SafeAreaView style={{
                        flex: 1,
                        padding: scale(15),
                        backgroundColor: '#E1DFDF',
                    }}>
                        {AllOrders.length !== 0 ? <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index)}
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
                                        fontFamily: 'sans-serif-light',
                                        // fontWeight: '700',
                                        letterSpacing: scale(0.5),
                                        color: '#000',
                                        marginTop: verticalScale(5),

                                    }}>
                                        <Text style={{
                                            color: '#D20F0F'
                                        }}> No results for</Text>
                                        <Text style={{ fontWeight: "600" }}> "{query}"</Text>
                                    </Text>

                                </View>
                            }
                            ListHeaderComponent={renderHeader(query, AllOrders, setData, setQuery, searchRef, setloading)}
                        />
                            :
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

                                {loading ? <Text style={{
                                    marginTop: scale(50),
                                    fontFamily: 'sans-serif-thin',
                                    fontWeight: '700',
                                    letterSpacing: scale(0.5),
                                    color: 'red'
                                }}>
                                    Loading your orders...
                                </Text> :
                                    <Text style={{
                                        fontWeight: '600',
                                        letterSpacing: scale(0.5),
                                        color: '#000',
                                        fontSize: normalize(15)
                                    }}>
                                        You haven't ordered anything yet 🙁.
                                    </Text>
                                }
                            </View>
                        }
                    </SafeAreaView>}
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
        paddingBottom: scale(15),
        marginLeft: scale(15),
        marginRight: scale(15),
        borderWidth: scale(0.5),
        marginTop: scale(8),
        marginBottom: scale(9),
        marginVertical: verticalScale(0),
        borderRadius: scale(10),
        backgroundColor: '#8DBEA2',
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
        fontWeight: "600",
        // paddingTop: 40
    },
        description: {
            fontSize: normalize(10),
        fontStyle: 'italic',
    },
        photo: {
            height: verticalScale(40),
        width: scale(44),
        borderRadius: scale(9)
    },
});

        export default ItemListViewCompletedOrdersUsers;
