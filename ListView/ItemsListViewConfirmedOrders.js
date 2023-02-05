import React, { useEffect, useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";

import QRCode from 'react-native-qrcode-svg';
import GoogleMap from '../GoogleMap';

import { scale, moderateScale, verticalScale } from '../Dimensions';

import { normalize } from '../FontResize';


const Item = ({ id, OrderId, title, image_url, price, description, category, displayCategory, quantity, ItemAddedDate }) => (
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
                    <Image source={{ uri: image_url }} style={styles.photo} />
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

const ItemsListViewConfirmedOrders = ({ AllItems, AllOrders, }) => {

    const [update, setupdate] = useState(false);

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

    useEffect(() => {
        setvisibleMap(false);
    }, [])

    const toggleFunction = (index) => {
        AllOrders[index].toggle = !AllOrders[index].toggle;
        setToggle(!toggle);
    };

    const handlePressQRcode = (index) => {
        setindex(index);
        setdisplayQRCode(!displayQRCode);
        settotalamount(AllOrders[index].totalamount);
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
                        }}>{AllOrders[index].totalamount}/-</Text>
                </View>
                <View>
                    <MaterialIcons name="location-pin" size={normalize(20)} color="#dc143c"
                        onPress={() => {
                            
                            if (!AllOrders[index].Longitude && !AllOrders[index].Latitude && AllOrders[index].Location !== '') {
                                Alert.alert('Exact Location Not Found', `But Location Address is mentioned as ${AllOrders[index].Location}`, [
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

                            

                            if (AllOrders[index].Longitude && AllOrders[index].Latitude && AllOrders[index].Location !== '') {
                                setlongitude(AllOrders[index].Longitude);

                                setlatitude(AllOrders[index].Latitude);
                                setvisibleMap(true);
                            }
                        }
                        }
                    />
                </View>
                <View>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={normalize(20)} color="green"
                        onPress={() => {
                            
                            set(ref(database, `users/userpendingOrders/${AllOrders[index].phoneNumber}/${AllOrders[index].key}/`), {
                            });

                            Alert.alert(`Delivered Location : ${AllOrders[index].Location}`);
                            for (var i = 0; i < AllOrders[index].value.length; i++) {
                                set(ref(database, `users/completedOrders/${AllOrders[index].value[i].phoneNumber}/${AllOrders[index].value[i].OrderId}/items/${AllOrders[index].value[i].ItemCategory}/` + AllOrders[index].value[i].key), {
                                    ItemId: AllOrders[index].value[i].key,
                                    OrderId: AllOrders[index].value[i].OrderId,
                                    ItemName: AllOrders[index].value[i].ItemName,
                                    ItemPrice: AllOrders[index].value[i].ItemPrice,
                                    ItemDesc: AllOrders[index].value[i].ItemDesc,
                                    ItemImage: AllOrders[index].value[i].ItemImage,
                                    ItemCategory: AllOrders[index].value[i].ItemCategory,
                                    ItemQuantity: AllOrders[index].value[i].ItemQuantity,
                                    ItemAddedDate: AllOrders[index].value[i].ItemAddedDate,
                                    phoneNumber: AllOrders[index].value[i].phoneNumber,
                                    Latitude: AllOrders[index].Latitude,
                                    Longitude: AllOrders[index].Longitude,
                                    Location: AllOrders[index].Location,
                                    OrderConfirmed: true,
                                    OrderConfirmedByAdmin: true,
                                    OrderPending: false,
                                    OrderDelivered: true
                                });
                            }

                        }}
                    />
                </View>

            </View>


            {AllOrders[index].toggle ? <FlatList
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
            {visibleMap ? <GoogleMap Longitude={longitude} Latitude={latitude} setvisibleMap={setvisibleMap} /> :

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
                                    }}>Order Id : {AllOrders[index].value[0].OrderId}</Text>
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
                                    }}>Total Amount : {AllOrders[index].totalamount}</Text>
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
                                    value={`upi://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${AllOrders[index].totalamount}&cu=INR`}
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
                        : <FlatList
                            data={AllOrders}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index)}
                        />}
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