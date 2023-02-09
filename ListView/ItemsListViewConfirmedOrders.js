import React, { createRef, useEffect, useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, TextInput, Keyboard, Text, StatusBar, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update, onValue, child } from "firebase/database";

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
            color: 'white',
            letterSpacing: scale(0.5),
            paddingRight: scale(15),
        }}>{category.toUpperCase()}</Text> : <></>}

        <View style={styles.container}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                // paddingRight: scale(8),
                // alignItems: 'center',
                // alignItems: "flex-start",
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
        </View>
    </>
);

const renderHeader = (query, DATA, setData, setQuery, searchRef, setloading) => {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                padding: scale(5),
                // marginTop: verticalScale(10),
                // marginHorizontal: scale(12),
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

const ItemsListViewConfirmedOrders = ({ AllItems, AllOrders, loading, setloading }) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [toggle, setToggle] = useState(true);

    const [displayQRCode, setdisplayQRCode] = useState(false);

    const [totalamount, settotalamount] = useState('');

    const [index, setindex] = useState("");


    const [visibleMap, setvisibleMap] = useState(false);

    const [latitude, setlatitude] = useState('');
    const [longitude, setlongitude] = useState('');

    const [refresh, setRefresh] = useState('');

    const [delivered, setdelivered] = useState([]);

    const [query, setQuery] = useState('');

    const searchRef = createRef();

    const [itemsList, setitemsList] = useState(ref(database, `users/userpendingOrders/`));



    const [data, setData] = useState(AllOrders);

    useEffect(() => {
        setvisibleMap(false);
        setQuery('');
        if (searchRef && searchRef.current) {
            searchRef.current.clear()
        }
        setData(AllOrders)
    }, [AllOrders])



   
    useEffect(() => {

        setloading(true);

        const getitemsDelivered = onValue(itemsList, (snapshot) => {

            var itemsdelivered = []

            snapshot.forEach((allItems) => {

                allItems.forEach((child) => {
                    itemsdelivered.push({
                        key: child.key, Delivered: false
                    });
                })
            })

            setdelivered(itemsdelivered)

            setloading(false);
        });

        return () => {
            getitemsDelivered();
        }

    }, [])


    const toggleFunction = (index) => {
        setloading(true)
        data[index].toggle = !data[index].toggle;
        setToggle(!toggle);
        setloading(false)
    };


    const Delivered = (index) => {

        setloading(true)

        var flag = false;

        try {
            delivered.forEach((item) => {
                if (item.key === data[index].key) {
                    flag = true
                }
            })

            setloading(false)

            return flag

        }
        catch (error) {
            setloading(false)

            return false;
        }

    }

    const handlePressQRcode = (index) => {
        setloading(true)
        setindex(index);
        setdisplayQRCode(!displayQRCode);
        settotalamount(data[index].totalamount);
        setloading(false)
    }

    const renderItem = ({ item, index }) => (
        <View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(10),
                padding: scale(16),
                borderRadius: scale(5),
                backgroundColor: '#a9a9a9',
                elevation: scale(5),
            }}>
                <View>
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: normalize(16),
                            fontWeight: "600",
                            color: '#000'
                        }}>{index + 1}. {item.key}</Text>
                </View>
                <View>
                    <Text onPress={() =>
                        handlePressQRcode(index)
                    }
                        style={{
                            fontSize: normalize(16),
                            fontWeight: "600",
                            color: '#000'
                        }}>{data[index].totalamount}/-</Text>
                </View>
                <View>
                    <MaterialIcons name="location-pin" size={normalize(20)} color="#dc143c"
                        onPress={() => {

                            setloading(true)

                            if (!data[index].Longitude && !data[index].Latitude && data[index].Location !== '') {
                                Alert.alert('Exact Location Not Found', `But Location Address is mentioned as ${data[index].Location}`, [
                                    {
                                        text: 'Want to Call?',
                                        // onPress: () => console.log("call.."),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Want to Continue',
                                    },
                                ])
                            }



                            if (data[index].Longitude && data[index].Latitude && data[index].Location !== '') {
                                setlongitude(data[index].Longitude);

                                setlatitude(data[index].Latitude);

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
                {Delivered(index) ?
                    <View>
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={normalize(20)} color="green"
                            onPress={() => {

                                setloading(true)

                                set(ref(database, `users/userpendingOrders/${data[index].phoneNumber}/${data[index].key}/`), {
                                });

                                Alert.alert(`Delivered Location : ${data[index].Location}`);
                                for (var i = 0; i < data[index].value.length; i++) {

                                    set(ref(database, `users/completedOrders/${data[index].value[i].phoneNumber}/${data[index].value[i].OrderId}/items/${data[index].value[i].ItemCategory}/` + data[index].value[i].key), {
                                        ItemId: data[index].value[i].key,
                                        OrderId: data[index].value[i].OrderId,
                                        ItemName: data[index].value[i].ItemName,
                                        ItemPrice: data[index].value[i].ItemPrice,
                                        ItemDesc: data[index].value[i].ItemDesc,
                                        ItemImage: data[index].value[i].ItemImage,
                                        ItemCategory: data[index].value[i].ItemCategory,
                                        ItemQuantity: data[index].value[i].ItemQuantity,
                                        ItemAddedDate: data[index].value[i].ItemAddedDate,
                                        phoneNumber: data[index].value[i].phoneNumber,
                                        Latitude: data[index].Latitude,
                                        Longitude: data[index].Longitude,
                                        Location: data[index].Location,
                                        OrderConfirmed: true,
                                        OrderConfirmedByAdmin: true,
                                        OrderPending: false,
                                        OrderDelivered: true
                                    });
                                }

                                setloading(false)

                            }}
                        />
                    </View>
                    : false}

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
                            setloading={setloading}
                            image_url={item.ItemImage}
                            description={item.ItemDesc}
                            price={item.ItemPrice}
                            category={item.ItemCategory}
                            quantity={item.ItemQuantity}
                            ItemAddedDate={item.ItemAddedDate}
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
                        backgroundColor: '#3B3636',
                    }}>
                        {displayQRCode ? <View style={{
                            flex: 1,
                            // padding: scale(15),
                            borderRadius: scale(8),
                            backgroundColor: '#fff',
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginBottom: verticalScale(10),
                                padding: scale(18),
                                // backgroundColor: 'pink',
                            }}>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: scale(10),
                                    borderRadius: scale(5),
                                    elevation: scale(5),
                                    backgroundColor: 'lightblue'
                                }}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        padding: scale(5),
                                        borderRadius: scale(5),
                                        // elevation: 2,
                                        // backgroundColor: 'lightgreen'
                                    }}
                                    >
                                        <Text style={{
                                            fontSize: normalize(16),
                                            fontWeight: "600",
                                        }}>Order Id : {data[index].value[0].OrderId}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        padding: scale(5),
                                        borderRadius: scale(5),
                                        // elevation: 2,
                                        // backgroundColor: 'lightgreen'
                                    }}
                                    >
                                        <Text style={{
                                            fontSize: normalize(16),
                                            fontWeight: "600",
                                        }}>Total Amount : {data[index].totalamount}</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: scale(10),
                                    borderRadius: scale(5),
                                    borderWidth: scale(1),
                                    borderRadius: scale(8),
                                }}
                                >
                                    <QRCode
                                        value={`upi://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${data[index].totalamount}&cu=INR`}
                                        size={300}
                                    // getRef={(c) => console.log(c)}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: scale(10),
                                    borderRadius: scale(5),
                                    elevation: scale(2),
                                    backgroundColor: 'lightgreen'
                                }}
                                >
                                    <Text style={{
                                        fontSize: normalize(16),
                                        fontWeight: "600",
                                    }}
                                        onPress={() => handlePressQRcode(index)}>Payment Done ?</Text>
                                </View>
                            </View>
                        </View>
                            : AllOrders.length !== 0 ? <FlatList
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
                                        // padding: scale(34),
                                        fontFamily: 'sans-serif-thin',
                                        fontWeight: '700',
                                        letterSpacing: scale(0.5),
                                        color: 'red'
                                    }}>
                                        Loading orders...
                                    </Text> :
                                        <Text style={{
                                            fontWeight: '600',
                                            letterSpacing: scale(0.5),
                                            color: 'white',
                                            fontSize: normalize(15)
                                        }}>
                                            No orders
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
        height: verticalScale(40),
        width: scale(44),
        borderRadius: scale(9)
    },
});

export default ItemsListViewConfirmedOrders;