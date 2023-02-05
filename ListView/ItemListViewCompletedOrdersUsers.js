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
            fontWeight: "bold",
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

const ItemListViewCompletedOrdersUsers = ({ AllOrders }) => {

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

    const renderItem = ({ item, index }) => (
        <View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(10),
                padding: scale(16),
                borderRadius: scale(5),
                backgroundColor: '#808080',
                elevation: scale(5),
            }}>
                <View>
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: normalize(16),
                            fontWeight: "bold",
                            color: 'white'
                        }}>{index + 1}. {item.key}</Text>
                </View>
                <View>
                    <Text
                        style={{
                            fontSize: normalize(16),
                            fontWeight: "bold",
                            color: 'white'
                        }}>{AllOrders[index].totalamount}/-</Text>
                </View>
                <View>
                    <MaterialIcons name="location-pin" size={normalize(20)} color="red"
                        onPress={() => {

                            // console.log( AllOrders[index].Longitude,  AllOrders[index].Latitude, AllOrders[index].Location)



                            if (!AllOrders[index].Longitude && !AllOrders[index].Latitude && AllOrders[index].Location !== '') {
                                Alert.alert('Order Delivered', `Exact Location is not found. But Order Delivered to ${AllOrders[index].Location}`, [
                                    {
                                        text: 'OK',
                                    },
                                ])
                            }

                            if (AllOrders[index].Longitude && AllOrders[index].Latitude && AllOrders[index].Location !== '') {
                                setlongitude(AllOrders[index].Longitude);
                                setlatitude(AllOrders[index].Latitude);
                                setvisibleMap(true);
                            }

                            // if (longitude !== '' && latitude !== '' && AllOrders[index].Location !== '') {
                            //     setvisibleMap(true)
                            // }
                            // else {
                            //     Alert.alert('Correct Location Not Found', 'Please call the person to confirm the Location...', [
                            //         {
                            //             text: 'Want to Call?',
                            //             onPress: () => console.log("call.."),
                            //             style: 'cancel',
                            //         },
                            //         {
                            //             text: 'Want to Continue', onPress: () =>
                            //                 console.log("continue..")
                            //         },
                            //     ])
                            // }

                        }
                        }
                    />
                </View>
                {/* <View>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={normalize(20)} color="green"
                        onPress={() => {
                            alert(`Order Delivered To ${AllOrders[index].Location}`);
                        }}
                    />
                </View> */}

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
                    backgroundColor: '#dcdcdc',
                }}>
                    <FlatList
                        data={AllOrders}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
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
        backgroundColor: '#ffb6c1',
        elevation: scale(5),
    },
    title_item: {
        fontSize: normalize(13),
        color: '#000',
    },
    title_price: {
        fontSize: normalize(13),
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

export default ItemListViewCompletedOrdersUsers;
