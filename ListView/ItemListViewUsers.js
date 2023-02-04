import React, { useState, useEffect } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";

import { scale, moderateScale, verticalScale } from '../Dimensions';

const Item = ({ index, setItemId, setItemCategory, showfooter, handleIncrease, qtyhandlervisible, handleDecrease, setItemName, setItemImage, setItemDesc, setItemPrice, id, ItemQuantity, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: moderateScale(15, 0.2),
        fontWeight: "bold",
        marginLeft: scale(15),
        marginTop: scale(10),
        color: 'white',
        letterSpacing: scale(0.5),
        // fontStyle: 'italic'
    }}>{category.toUpperCase()}</Text> : <></>}
        <View>

            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
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
                    justifyContent: 'space-between'
                }}
                >
                    <View style={{ borderWidth: scale(1), borderRadius: scale(10) }}>
                        <View>
                            <Image source={{ uri: image_url }} style={
                                styles.photo
                            } />
                        </View>
                        {/* {
                            !showfooter?
                        <View style={{ 
                            // justifyContent: 'flex-end', 
                            // alignItems: 'center',
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            borderWidth: scale(0),
                            borderRadius: scale(4),
                            width: scale(30),
                            backgroundColor: 'red',
                            padding: scale(5),
                            marginBottom: scale(0)
                            }}>
                            <Text style={{
                                fontSize: moderateScale(15),
                                textAlign: 'center'
                            }}>{ItemQuantity}</Text>
                        </View> : <></>
                        } */}
                    </View>
                    <View>
                        {(qtyhandlervisible && showfooter) ?
                            <View style={styles.container_add}>
                                {ItemQuantity > 0 ?
                                    <View
                                        style={styles.container_addremove}
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
                                        <View style={{ justifyContent: 'center', flex: 1, }}
                                        >
                                            <Text style={
                                                [
                                                    StyleSheet.absoluteFill,
                                                    {
                                                        fontWeight: 'bold',
                                                        fontSize: moderateScale(15),
                                                        backgroundColor: '#dcdcdc',
                                                        borderLeftWidth: scale(0.5),
                                                        borderRightWidth: scale(0.5),
                                                        color: "black",
                                                        paddingTop: verticalScale(3),
                                                        textAlign: 'center',
                                                    }
                                                ]
                                            }>{ItemQuantity}</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', flex: 1 }}>
                                            <Ionicons name="md-add-outline" size={scale(20)} color="black"
                                                onPress={() => handleIncrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View >
                                        <View
                                        // style={{ justifyContent: 'center', flex: 1 }}
                                        >
                                            <Text style={{
                                                textAlign: 'center',
                                                color: "black",
                                                paddingTop: scale(2),
                                                fontSize: moderateScale(18),
                                                fontWeight: "bold"
                                            }} onPress={() => handleIncrease(index)}>ADD</Text>
                                        </View>
                                    </View>}
                            </View>
                            :
                            <></>
                        }

                        {(qtyhandlervisible && !showfooter) ?
                            <View style={styles.container_add}>
                                <View >
                                    <Text style={{
                                        textAlign: 'center',
                                        color: "black",
                                        paddingTop: scale(2),
                                        fontSize: moderateScale(18),
                                        fontWeight: "bold"
                                    }} onPress={() => handleIncrease(index)}>{ItemQuantity}</Text>
                                </View>
                            </View> : <></>}

                    </View>
                </View>
            </View>
        </View>
    </>
);

const ItemsListViewUsers = ({ navigation, DATA, OrderId, qtyhandler, showfooter, totalamount, settotalamount}) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [refresh, setRefresh] = useState('');
    const [qtyhandlervisible, setqtyhandlervisible] = useState(qtyhandler);
    // const [totalamount, settotalamount] = useState(0)

    const [data, setData] = useState(DATA);
    useEffect(() => { setData(DATA) }, [DATA])

    const handleIncrease = (index) => {
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
    };

    const handleDecrease = (index) => {

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
        />
    );

    const checkcart = () => {

        if (totalamount <= 0) {
            Alert.alert('No Items In Cart', `Please select atleast one item to order`, [
                {
                    text: 'OK',
                },
            ])
        }
        else {
            // Alert.alert('Total Amount', `${totalamount} Rs`, [
            //     {
            //         text: 'OK',
            //     },
            // ])
            navigation.navigate("Confirm Order", { OrderId: OrderId })
        }
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#778899'
            // backgroundColor: ''
        }}>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
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
                    fontSize: moderateScale(18),
                    paddingLeft: scale(8),
                    color: 'black',
                    fontWeight: 'bold'
                }} >Total Amount : {totalamount}/-</Text></View>

                <View
                    style={{
                        justifyContent: 'center',
                        paddingLeft: scale(28),
                        paddingRight: scale(28),
                        borderWidth: scale(1),
                        borderColor: 'black',
                        backgroundColor: "#fa8072",
                        borderRadius: scale(5),
                    }}
                ><Text style={{
                    textAlign: 'center',
                    fontSize: moderateScale(22),
                    color: 'white',
                    fontWeight: 'bold'
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
                    fontSize: moderateScale(18),
                    paddingLeft: scale(8),
                    color: 'black',
                    fontWeight: 'bold'
                }} >Total Amount : {totalamount}/-</Text></View>
            </View> : <></>}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: verticalScale(190),
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        marginLeft: scale(15),
        marginRight: scale(15),
        marginTop: scale(8),
        marginBottom: scale(9),
        borderRadius: scale(10),
        backgroundColor: '#ffe4e1',
        elevation: scale(10),
    },
    title_item: {
        fontSize: moderateScale(15),
        color: '#000',
    },
    title_price: {
        fontSize: moderateScale(15),
        color: '#000',
        // paddingTop: 40
    },
    total_item_price: {
        fontSize: moderateScale(23),
        color: '#000',
        paddingTop: scale(10),
    },
    container_addremove: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'flex-start'
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
    description: {
        fontSize: moderateScale(10),
        fontStyle: 'italic',
    },
    photo: {
        height: verticalScale(125),
        width: scale(148),
        borderRadius: scale(9)
    },
});

export default ItemsListViewUsers;