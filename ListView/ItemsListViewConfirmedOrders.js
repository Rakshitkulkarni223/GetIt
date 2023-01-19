import React, { useEffect, useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";

import QRCode from 'react-native-qrcode-svg';
import GoogleMap from '../GoogleMap';



const Item = ({ id, OrderId, title, image_url, price, description, category, displayCategory, quantity, ItemAddedDate }) => (
    <>
        {displayCategory ? <Text style={{
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
            <View style={styles.container_price}>
                <Text style={styles.title}>
                    {quantity}
                </Text>
            </View>
            <View style={styles.container_update}>
                {/* <AntDesign name="checkcircleo" size={24} color="green" onPress={()=>{
                }}/> */}
            </View>
            <View style={styles.container_update}>
                {/* <Entypo name="cross" size={24} color="red" onPress={()=>{
                    set(ref(database, `users/confirmedOrders/${OrderID}/items/${category}/` + id), {
                    });
                }}/> */}
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
                marginBottom: 10,
                padding: 20,
                borderRadius: 5,
                backgroundColor: 'pink',
                elevation: 2,
            }}>
                <View>
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}>{index + 1}. {item.key}</Text>
                </View>
                <View>
                    <Text onPress={() =>
                        handlePressQRcode(index)
                    }
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}>{AllOrders[index].totalamount}/-</Text>
                </View>
                <View>
                    <MaterialIcons name="location-pin" size={24} color="red"
                        onPress={() => {

                            // console.log( AllOrders[index].Longitude,  AllOrders[index].Latitude, AllOrders[index].Location)



                            if (!AllOrders[index].Longitude && !AllOrders[index].Latitude && AllOrders[index].Location !== '') {
                                Alert.alert('Exact Location Not Found', `But Location Address is mentioned as ${AllOrders[index].Location}`, [
                                    {
                                        text: 'Want to Call?',
                                        // onPress: () => console.log("call.."),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Want to Continue',
                                        // onPress: () =>
                                        //     console.log("continue..")
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
                <View>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={25} color="green"
                        onPress={() => {
                            alert(`Order Delivered To ${AllOrders[index].Location}`);
                            set(ref(database, `users/completedOrders/${AllOrders[index].value[0].AuthId}/${AllOrders[index].value[0].OrderId}/items/${AllOrders[index].value[0].ItemCategory}/` + AllOrders[index].value[0].key), {
                                ItemId: AllOrders[index].value[0].key,
                                AuthId: AllOrders[index].value[0].AuthId,
                                OrderId: AllOrders[index].value[0].OrderId,
                                ItemName: AllOrders[index].value[0].ItemName,
                                ItemPrice: AllOrders[index].value[0].ItemPrice,
                                ItemDesc: AllOrders[index].value[0].ItemDesc,
                                ItemImage: AllOrders[index].value[0].ItemImage,
                                ItemCategory: AllOrders[index].value[0].ItemCategory,
                                ItemQuantity: AllOrders[index].value[0].ItemQuantity,
                                ItemAddedDate: AllOrders[index].value[0].ItemAddedDate,
                                Location: AllOrders[index].Location,
                                OrderConfirmed: true,
                                OrderConfirmedByAdmin: true,
                                OrderPending: false,
                                OrderDelivered: true
                            });
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
            {visibleMap ? <GoogleMap Longitude={longitude} Latitude={latitude} /> :

                <SafeAreaView style={styles.container}>
                    {displayQRCode ? <>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                            padding: 20,
                            borderRadius: 5,
                            // backgroundColor: 'pink',
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: 10,
                                borderRadius: 5,
                                elevation: 2,
                                backgroundColor: 'lightblue'
                            }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: 5,
                                    borderRadius: 5,
                                    // elevation: 2,
                                    // backgroundColor: 'lightgreen'
                                }}
                                >
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    }}>Order Id : {AllOrders[index].value[0].OrderId}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: 5,
                                    borderRadius: 5,
                                    // elevation: 2,
                                    // backgroundColor: 'lightgreen'
                                }}
                                >
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    }}>Total Amount : {AllOrders[index].totalamount}</Text>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                padding: 10,
                                borderRadius: 5,
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
                                padding: 10,
                                borderRadius: 5,
                                elevation: 2,
                                backgroundColor: 'lightgreen'
                            }}
                            >
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                }}
                                    onPress={() => handlePressQRcode(index)}>Payment Done ?</Text>
                            </View>
                        </View>
                    </>
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
    },
});

export default ItemsListViewConfirmedOrders;