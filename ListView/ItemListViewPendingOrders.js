import React, { createRef, useEffect, useState } from 'react';
import { SafeAreaView, Modal, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert, TextInput, Keyboard, Linking } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";
import GoogleMap from '../GoogleMap';

import QRCode from 'react-native-qrcode-svg';
import { scale, moderateScale, verticalScale } from '../Dimensions';

import { normalize } from '../FontResize';
import ActivityIndicatorElement from '../ActivityIndicatorElement';
import { NotificationHandler } from '../NotificationHandler';


const Item = ({ id, setloading, OrderId, title, image_url, price, description, category, displayCategory, quantity, ItemAddedDate, phoneNumber, OrderStatus, Location, Longitude, Latitude }) => (
    <>
        {displayCategory ? <Text style={{
            fontSize: normalize(13),
            fontWeight: "600",
            marginLeft: scale(15),
            marginTop: scale(10),
            color: 'black',
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

            {/* <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}> */}

            {/* <View>
                    <AntDesign name="checkcircleo" size={24} color="green" onPress={() => {
                        setloading(true)
                        AddRemoveItem(true, { id, OrderId, title, image_url, price, description, category, quantity, ItemAddedDate, phoneNumber, OrderStatus, Location, Longitude, Latitude });
                        setloading(false)
                    }} />
                </View>
                <View
                >
                    <Entypo name="cross" size={24} color="red" onPress={() => {
                        setloading(true)
                        AddRemoveItem(false, { id, OrderId, title, image_url, price, description, category, quantity, ItemAddedDate, phoneNumber, OrderStatus, Location, Longitude, Latitude });
                        setloading(false)
                    }} />
                </View> */}
            {/* </View> */}
        </View>
    </>
);



const AddRemoveItem = async (add, { id, OrderId, title, image_url, price, description, category, quantity, ItemAddedDate, phoneNumber }) => {

    if (add) {
        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/items/${category}/` + id), {
            ItemId: id,
            ItemName: title,
            ItemPrice: price,
            ItemDesc: description,
            ItemImage: image_url,
            ItemCategory: category,
            ItemQuantity: quantity,
            ItemAddedDate: ItemAddedDate
        })

        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/orderStatus`), {
            OrderStatus: 0
        })
        await NotificationHandler(true, phoneNumber, `Order Confimred 😍🎉 Order Id: ${OrderId}`, `Your order will be delivered soon.`)
    }
    if (!add) {
        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/`), {
        })
        await NotificationHandler(true, phoneNumber, `Order Not Confimred ❌ Order Id: ${OrderId}`, `Sorry,🙁 your order has been cancelled due to some reason.`)
    }
}

const OrderDelivered = async (delivered, { OrderId, phoneNumber, Location }) => {
    if (delivered) {
        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/orderStatus`), {
            OrderStatus: 1
        })

        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/paymentStatus`), {
            Paid: 1
        })

        await NotificationHandler(true, phoneNumber, `Order Delivered 🍽️😋 Order Id: ${OrderId}`, `Delivery Location 📌: ${Location}`)
        // await NotificationHandler(true,phoneNumber,`Thank you ❤️`, ``)

    }
    if (!delivered) {
        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/orderStatus`), {
            OrderStatus: 2
        })

        set(ref(database, `users/${phoneNumber}/orders/${OrderId}/paymentStatus`), {
            Paid: 0
        })
        await NotificationHandler(true, phoneNumber, `Order Not Delivered ❌ Order Id: ${OrderId}`, `Sorry,🙁 your order has been cancelled due to some reason.`)
    }
}

const ConfirmAllItems = (data, index, addorremove) => {
    for (let item = 0; item < data[index].value.length; item++) {
        AddRemoveItem(addorremove,
            {
                id: data[index].value[item].key,
                OrderId: data[index].OrderId,
                title: data[index].value[item].ItemName,
                image_url: data[index].value[item].ItemImage,
                price: data[index].value[item].ItemPrice,
                description: data[index].value[item].ItemDesc,
                category: data[index].value[item].ItemCategory,
                quantity: data[index].value[item].ItemQuantity,
                ItemAddedDate: data[index].value[item].ItemAddedDate,
                phoneNumber: data[index].phoneNumber,
            });
    }
}


const renderHeader = (query, DATA, setData, setQuery, searchRef, setloading, visible, setvisible, sortedByAmount, sortedByOrderStatus, sortedByTime, setsortedByAmount, setsortedByOrderStatus, setsortedByTime, sortedByDefault, setsortedByDefault) => {


    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
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
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Ionicons name="search" size={scale(15)} color="black" />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: scale(10),
                }}>
                    <View style={{
                        width: '90%',
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <TextInput
                                style={{
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
                    </View>
                    {query ?
                        <View style={{
                            justifyContent: 'center',
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
            </View>
            <View style={{
                justifyContent: 'center',
                marginLeft: scale(5),
            }}>
                <MaterialIcons name="sort" size={normalize(22)} color="black" onPress={() => {
                    setvisible(true)
                }} />
            </View>
            <Modal visible={visible} transparent={true}>
                <View style={{
                    top: "13%",
                    width: "42%",
                    position: 'absolute',
                    right: scale(15),
                    backgroundColor: '#fff',
                    borderWidth: scale(1),
                    borderColor: 'black',
                    // borderRadius: scale(10),
                }}>

                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingVertical: verticalScale(5),
                            backgroundColor: sortedByDefault ? '#DADADA' : '#fff',
                            paddingHorizontal: scale(5),
                            borderBottomWidth: scale(1)
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                letterSpacing: scale(0.4)
                            }} onPress={() => {

                                DATA.sort(function (item1, item2) {
                                    var val1 = new Date(item1['Date']);
                                    var val2 = new Date(item2['Date']);
                                    if (val1 < val2) return 1;
                                    if (val1 > val2) return -1;
                                    return 0;
                                });
                                setsortedByTime(-1)
                                setsortedByAmount(-1)
                                setsortedByOrderStatus(-1)
                                setsortedByDefault(1)
                                setvisible(false)
                            }}>🔶 Default</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingVertical: verticalScale(5),
                            paddingHorizontal: scale(5),
                            backgroundColor: sortedByTime !== -1 ? '#DADADA' : '#fff',
                            borderBottomWidth: scale(1)
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                letterSpacing: scale(0.4)
                            }}
                                onPress={() => {
                                    DATA.sort(function (item1, item2) {
                                        var val1 = new Date(item1['Date']);
                                        var val2 = new Date(item2['Date']);
                                        if (val1 < val2) return sortedByTime === 0 ? -1 : 1;
                                        if (val1 > val2) return sortedByTime === 0 ? 1 : -1;
                                        return 0;
                                    });
                                    if (sortedByTime === -1) {
                                        setsortedByTime(0);
                                    }
                                    if (sortedByTime === 0) {
                                        setsortedByTime(1);
                                    }
                                    if (sortedByTime === 1) {
                                        setsortedByTime(0);
                                    }
                                    setsortedByAmount(-1)
                                    setsortedByOrderStatus(-1)
                                    setsortedByDefault(0)
                                    setvisible(false)
                                }}
                            >⌛ By time</Text>
                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingVertical: verticalScale(5),
                            backgroundColor: sortedByAmount !== -1 ? '#DADADA' : '#fff',
                            paddingHorizontal: scale(5),
                            borderBottomWidth: scale(1)
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                letterSpacing: scale(0.4)
                            }} onPress={() => {

                                DATA.sort(function (item1, item2) {
                                    var val1 = new Date(item1['totalamount']);
                                    var val2 = new Date(item2['totalamount']);
                                    if (val1 < val2) return sortedByAmount === 0 ? -1 : 1;
                                    if (val1 > val2) return sortedByAmount === 0 ? 1 : -1;
                                    return 0;
                                });
                                if (sortedByAmount === -1) {
                                    setsortedByAmount(0);
                                }
                                if (sortedByAmount === 0) {
                                    setsortedByAmount(1);
                                }
                                if (sortedByAmount === 1) {
                                    setsortedByAmount(0);
                                }
                                setsortedByTime(-1)
                                setsortedByOrderStatus(-1)
                                setsortedByDefault(0)
                                setvisible(false)
                            }}>💰 By amount</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingVertical: verticalScale(5),
                            paddingHorizontal: scale(5),
                            backgroundColor: sortedByOrderStatus !== -1 ? '#DADADA' : '#fff',
                            // borderBottomWidth: scale(0.5)
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                letterSpacing: scale(0.4)
                            }} onPress={() => {
                                DATA.sort(function (item1, item2) {
                                    var val1 = new Date(item1['OrderStatus']);
                                    var val2 = new Date(item2['OrderStatus']);
                                    if (val1 < val2) return sortedByOrderStatus === 0 ? -1 : 1;
                                    if (val1 > val2) return sortedByOrderStatus === 0 ? 1 : -1;
                                    return 0;
                                });
                                // setsortedByOrderStatus(sortedByOrderStatus === -1 ? sortedByOrderStatus === 0 ? 1 : sortedByOrderStatus === 1 ? 0 :)
                                if (sortedByOrderStatus === -1) {
                                    setsortedByOrderStatus(0);
                                }
                                if (sortedByOrderStatus === 0) {
                                    setsortedByOrderStatus(1);
                                }
                                if (sortedByOrderStatus === 1) {
                                    setsortedByOrderStatus(0);
                                }

                                setsortedByTime(-1)
                                setsortedByAmount(-1)
                                setsortedByDefault(0)
                                setvisible(false)
                            }}>✅ By order status</Text>
                        </View>
                    </View>
                </View>
            </Modal>
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


const ItemsListViewPendingOrders = ({ AllItems, AllOrders, loading, setloading }) => {

    const [update, setupdate] = useState(false);

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [toggle, setToggle] = useState(true);

    const [visibleMap, setvisibleMap] = useState(false);

    const [latitude, setlatitude] = useState('');
    const [longitude, setlongitude] = useState('');

    const [query, setQuery] = useState('');
    const [displayQRCode, setdisplayQRCode] = useState(false);

    const searchRef = createRef();

    const [visible, setvisible] = useState(false);

    const [index, setindex] = useState("");

    const [data, setData] = useState(AllOrders);

    const [sortedByDefault, setsortedByDefault] = useState(1);
    const [sortedByAmount, setsortedByAmount] = useState(-1);
    const [sortedByTime, setsortedByTime] = useState(-1);
    const [sortedByOrderStatus, setsortedByOrderStatus] = useState(-1);

    useEffect(() => {
        setvisibleMap(false);
        setQuery('');
        if (searchRef && searchRef.current) {
            searchRef.current.clear()
        }
        AllOrders.sort(function (item1, item2) {
            var val1 = item1['OrderStatus'];
            var val2 = item2['OrderStatus'];
            if (val1 > val2) return 1;
            if (val1 < val2) return -1;
            return 0;
        });

        setData(AllOrders)
    }, [AllOrders])

    useEffect(() => {
        setvisible(false);
    }, [])


    const toggleFunction = (index) => {
        setloading(true)
        data[index].toggle = !data[index].toggle;
        setToggle(!toggle);
        setloading(false)
    };

    const handlePressQRcode = (index) => {
        try {
            setloading(true)
            setindex(index);
            setdisplayQRCode(!displayQRCode);
            settotalamount(data[index].totalamount);
            setloading(false)
        }
        catch (err) {
            setloading(false)
        }
    }


    const renderItem = ({ item, index }) => (
        <View>

            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(10),
                padding: scale(12),
                borderRadius: scale(5),
                backgroundColor: index % 2 ? "#AEB4BB" : '#CED0D2',
                borderWidth: scale(0.7),
                elevation: scale(2),
            }}>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: normalize(14),
                            fontWeight: "600",
                            color: '#000'
                        }}>{index + 1}. {item.key}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text onPress={() =>
                        handlePressQRcode(index)
                    }
                        style={{
                            fontSize: normalize(14),
                            fontWeight: "600",
                            color: '#000'
                        }}>₹{data[index].totalamount}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    {
                        data[index].OrderStatus === -1 ?

                            <MaterialCommunityIcons name="clock-alert" size={normalize(16)} color="#A89009"
                                onPress={() => {
                                    Alert.alert('Order Status', 'Pending', [
                                        {
                                            text: "OK",
                                        }
                                    ])
                                }}
                            /> :

                            data[index].OrderStatus === 0 ?
                                <MaterialCommunityIcons name="clock-check" size={normalize(16)} color="#0AA560" onPress={() => {
                                    Alert.alert('Order Status', 'Confirmed', [
                                        {
                                            text: "OK",
                                        }
                                    ])

                                }} />
                                : data[index].OrderStatus === 1 ?
                                    <MaterialCommunityIcons name="check-decagram" size={normalize(16)} color="#07BA5B" onPress={() => {
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

                <View style={{
                    justifyContent: 'center'
                }}>
                    <MaterialIcons name="location-pin" size={normalize(16)} color="#D5380D"
                        onPress={() => {

                            // console.log( data[index].Longitude,  data[index].Latitude, data[index].Location)

                            setloading(true)

                            if (data[index].OrderStatus === 1 || data[index].OrderStatus === 2) {
                                setloading(false)
                                Alert.alert('Order Delivery Location 📌', `${data[index].Location}`, [
                                    {
                                        text: 'OK',
                                    },
                                ])
                            }

                            if (data[index].OrderStatus === -1 || data[index].OrderStatus === 0) {
                                if (!data[index].Longitude && !data[index].Latitude && data[index].Location !== '') {
                                    setloading(false)
                                    Alert.alert('Exact Location Not Found 📌', `But Location Address is mentioned as ${data[index].Location}`, [
                                        {
                                            text: 'Want to Call?',
                                            onPress: async () => {
                                                const url = `tel://${data[index].phoneNumber}`
                                                await Linking.openURL(url)
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Want to Continue',
                                        },
                                    ])
                                }

                                if (data[index].Longitude && data[index].Latitude && data[index].Location !== '') {

                                    setloading(false)
                                    setlongitude(data[index].Longitude);

                                    setlatitude(data[index].Latitude);

                                    Alert.alert('Order Delivery Location 📌', `${data[index].Location}`, [
                                        {
                                            text: 'Want to Call?',
                                            onPress: async () => {
                                                const url = `tel://${data[index].phoneNumber}`
                                                await Linking.openURL(url)
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Want to Continue',
                                        },
                                    ])
                                    // setvisibleMap(true);
                                }
                            }
                            setloading(false)
                        }
                        }
                    />
                </View>

                {
                    data[index].OrderStatus === 0 || data[index].OrderStatus === -1
                        ?

                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Feather name="check-square" size={normalize(16)} color="#0AA560"
                                onPress={() => {

                                    if (data[index].OrderStatus === -1) {
                                        Alert.alert('All items selected', 'Do you want confirm all items?', [
                                            {
                                                text: "Cancel",
                                                style: 'cancel'
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => {
                                                    setloading(true)
                                                    ConfirmAllItems(data, index, 1)
                                                    setloading(false)
                                                }
                                            }
                                        ])
                                    }

                                    if (data[index].OrderStatus === 0) {
                                        Alert.alert('Order Delivered?', `Delivery Location 📌: ${data[index].Location}`, [
                                            {
                                                text: "No, Not Delivered",
                                                onPress: () => {
                                                    setloading(true)
                                                    OrderDelivered(0, {
                                                        OrderId: data[index].OrderId,
                                                        phoneNumber: data[index].phoneNumber,
                                                        Location: data[index].Location
                                                    })
                                                    setloading(false)
                                                }
                                            },
                                            {
                                                text: "Yes, Delivered",
                                                onPress: () => {
                                                    setloading(true)
                                                    OrderDelivered(1, {
                                                        OrderId: data[index].OrderId,
                                                        phoneNumber: data[index].phoneNumber,
                                                        Location: data[index].Location
                                                    })
                                                    setloading(false)
                                                }
                                            }
                                        ])
                                    }
                                }}
                            />
                        </View> : undefined}

                {data[index].OrderStatus === -1 ?
                    <View>

                        <MaterialIcons name="delete-outline" size={normalize(18)} color="#E5453B"
                            onPress={() => {

                                Alert.alert('All items selected', 'Do you want cancel all items?', [
                                    {
                                        text: "Cancel",
                                        style: 'cancel'
                                    },
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            setloading(true)
                                            ConfirmAllItems(data, index, 0)
                                            setloading(false)
                                        }
                                    }
                                ])




                            }}
                        />
                    </View> : undefined}

            </View>
            {data[index].toggle ? <FlatList
                data={item.value}
                renderItem={({ item }) => (
                    <View>
                        <Item
                            id={item.key}
                            displayCategory={item.displayCategory}
                            displayUser={item.displayUser}
                            title={item.ItemName}
                            image_url={item.ItemImage}
                            description={item.ItemDesc}
                            price={item.ItemPrice}
                            category={item.ItemCategory}
                            quantity={item.ItemQuantity}
                            ItemAddedDate={item.ItemAddedDate}
                            OrderId={data[index].OrderId}
                            phoneNumber={data[index].phoneNumber}
                            OrderStatus={data[index].OrderStatus}
                            Location={data[index].Location}
                            Longitude={data[index].Longitude}
                            Latitude={data[index].Latitude}
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
                        paddingHorizontal: scale(15),
                        paddingTop: scale(15),
                        backgroundColor: '#DFDFDF',
                    }}>
                        {displayQRCode && data[index].OrderStatus === 0 ?
                            <View style={{
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
                                                letterSpacing: scale(0.3)
                                            }}>Order Id : {data[index].OrderId}</Text>
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
                                                letterSpacing: scale(0.3)
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
                                            size={normalize(240)}
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
                                            letterSpacing: scale(0.3)
                                        }}
                                            onPress={() => {
                                                handlePressQRcode(index)
                                                OrderDelivered(1, {
                                                    OrderId: data[index].OrderId,
                                                    phoneNumber: data[index].phoneNumber,
                                                    Location: data[index].Location
                                                })
                                            }
                                            }>Payment Done?</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            AllOrders.length !== 0 ?
                                <FlatList
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
                                    ListHeaderComponent={renderHeader(query, AllOrders, setData, setQuery, searchRef, setloading,
                                        visible,
                                        setvisible,
                                        sortedByAmount,
                                        sortedByOrderStatus,
                                        sortedByTime,
                                        setsortedByAmount,
                                        setsortedByOrderStatus,
                                        setsortedByTime,
                                        sortedByDefault,
                                        setsortedByDefault
                                    )}
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
                                            color: 'black',
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
        paddingBottom: scale(6),
        marginLeft: scale(15),
        marginRight: scale(15),
        marginTop: scale(8),
        marginBottom: scale(9),
        // marginVertical: verticalScale(0),
        borderWidth: scale(0.7),
        borderRadius: scale(10),
        backgroundColor: '#8DBEA2',
        elevation: scale(5),
    },
    title_item: {
        fontSize: normalize(13),
        color: '#000',
        fontWeight: '600'
    },
    title_price: {
        fontSize: normalize(13),
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
        color: '#000'
    },
    photo: {
        height: verticalScale(40),
        width: scale(44),
        overflow: "hidden",
        borderWidth: scale(0.8),
        borderColor: "#000",
        borderRadius: scale(9),
    },
});

export default ItemsListViewPendingOrders;