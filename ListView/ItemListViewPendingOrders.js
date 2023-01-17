import React, { useState } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import UpdateItem from '../admin/UpdateItem';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";


const Item = ({ id, AuthId, OrderId, title, image_url, price, description, category, displayCategory, quantity, ItemAddedDate, Location }) => (
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
                <AntDesign name="checkcircleo" size={24} color="green" onPress={() => {
                    set(ref(database, `admin/confirmedOrdersByAdmin/${OrderId}/items/${category}/` + id), {
                        ItemId: id,
                        AuthId: AuthId,
                        OrderId: OrderId,
                        ItemName: title,
                        ItemPrice: price,
                        ItemDesc: description,
                        ItemImage: image_url,
                        ItemCategory: category,
                        ItemQuantity: quantity,
                        ItemAddedDate: ItemAddedDate,
                        Location: Location,
                        OrderConfirmed: true,
                        OrderConfirmedByAdmin: true,
                        OrderPending: true,
                        OrderDelivered: false
                    });
                    set(ref(database, `users/confirmedOrders/${OrderId}/items/${category}/` + id), {
                    });
                }} />
            </View>
            <View style={styles.container_update}>
                <Entypo name="cross" size={24} color="red" onPress={() => {
                    set(ref(database, `users/confirmedOrders/${OrderId}/items/${category}/` + id), {
                    });
                }} />
            </View>
        </View>
    </>
);

const ItemsListViewPendingOrders = ({ AllItems, AllOrders }) => {

    const [update, setupdate] = useState(false);

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [toggle, setToggle] = useState(true);

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
                marginBottom: 10,
                padding: 20,
                borderRadius: 5,
                backgroundColor: 'orange',
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
                    <Text onPress={() => toggleFunction(index)}
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}>{AllOrders[index].totalamount}/-</Text>
                </View>
                <View>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={25} color="green"
                        onPress={() => {
                            alert("select all...");
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
                            OrderId={item.OrderId}
                            title={item.ItemName}
                            image_url={item.ItemImage}
                            description={item.ItemDesc}
                            price={item.ItemPrice}
                            AuthId={item.AuthId}
                            category={item.ItemCategory}
                            quantity={item.ItemQuantity}
                            ItemAddedDate={item.ItemAddedDate}
                            Location={AllOrders[index].Location}
                        />
                    </View>
                )
                }
                keyExtractor={(item, index) => String(index)}
            /> : <></>}
        </View>

    );

    return (

        <SafeAreaView style={styles.container}>
            <FlatList
                data={AllOrders}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
            />
        </SafeAreaView>

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

export default ItemsListViewPendingOrders;