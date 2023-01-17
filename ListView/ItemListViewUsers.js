import React, { useState, useEffect } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { app, auth, db, database } from "../Firebase";
import { ref, set, update } from "firebase/database";


const Item = ({ index, setItemId, setItemCategory, handleIncrease, qtyhandlervisible, handleDecrease, setItemName, setItemImage, setItemDesc, setItemPrice, id, ItemQuantity, title, image_url, price, description, category, displaycategory }) => (
    <>{displaycategory ? <Text style={{
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 16,
        marginTop: 10,
        // fontStyle: 'italic'
    }}>{category}</Text> : <></>}
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
                            {title}
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
                        </Text></View> : <></>}
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
                >
                    <View>
                        <Image source={{ uri: image_url }} style={styles.photo} />
                    </View>
                    <View>
                        {qtyhandlervisible ?
                            <View style={styles.container_add}>
                                {ItemQuantity > 0 ?
                                    <View
                                        style={styles.container_addremove}
                                    >
                                        <View
                                        >
                                            <AntDesign name="minus" size={30} color="black"
                                                onPress={() => handleDecrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                    // backgroundColor: 'lightblue'
                                                    borderRightWidth: 1,
                                                }}
                                            />
                                        </View>
                                        <View style={{
                                            justifyContent: 'center'
                                        }}
                                        >
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: 23,
                                                color: "white",
                                                textAlign: 'center',
                                            }}>{ItemQuantity}</Text>
                                        </View>

                                        <View style={{
                                            justifyContent: 'center'
                                        }}>
                                            <Ionicons name="md-add-outline" size={28} color="black"
                                                onPress={() => handleIncrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                    borderLeftWidth: 1,
                                                    borderLeftColor: 'black'
                                                }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View >
                                        <View>
                                            <Text style={{
                                                // paddingLeft: 45,
                                                // paddingTop: 4,
                                                textAlign: 'center',
                                                color: "black",
                                                fontSize: 27,
                                                fontWeight: "bold"
                                            }} onPress={() => handleIncrease(index)}>ADD</Text>
                                        </View>
                                    </View>}
                            </View> : <></>}
                    </View>
                </View>
            </View>
        </View>
    </>
);

const ItemsListViewUsers = ({ navigation, DATA, OrderId, qtyhandler, showfooter }) => {

    const [ItemName, setItemName] = useState("");
    const [ItemDesc, setItemDesc] = useState("");
    const [ItemCategory, setItemCategory] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [ItemImage, setItemImage] = useState("");
    const [ItemId, setItemId] = useState("");
    const [refresh, setRefresh] = useState('');
    const [qtyhandlervisible, setqtyhandlervisible] = useState(qtyhandler);
    const [totalamount, settotalamount] = useState(0)

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

        if(totalamount<=0)
        {
            Alert.alert('No Items In Cart', `Please select atleast one item to order`, [
                {
                   text: 'OK',
                },
             ])
        }
        else 
        {
            Alert.alert('Total Amount', `${totalamount} Rs`, [
                {
                   text: 'OK',
                },
             ])
            navigation.navigate("Confirm Order", { OrderId: OrderId })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
            />
            {showfooter ? <View style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                height: 55,
            }}>
                <View><Text style={{
                    paddingHorizontal: 43,
                    paddingVertical: 15,
                    textAlign: 'center',
                    borderRadius: 5,
                    borderColor: 'black',
                    backgroundColor: "#ffa07a",
                    borderWidth: 3,
                    height: 60,
                    fontSize: 20,
                    color: '#fdf5e6',
                    fontWeight: 'bold'
                }} onPress={checkcart}>Order Now</Text></View>

                <View><Text style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    textAlign: 'center',
                    borderColor: 'black',
                    backgroundColor: 'white',
                    height: 60,
                    fontSize: 23,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 6,
    },
    title_item: {
        fontSize: 16,
        color: '#000',
    },
    title_price: {
        fontSize: 16,
        color: '#000',
        // paddingTop: 40
    },
    total_item_price: {
        fontSize: 25,
        color: '#000',
        paddingTop: 85
    },
    container_addremove: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container_add: {
        // flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // paddingTop: 5,
        marginTop: -16,
        marginLeft: 35,
        marginVertical: 8,
        borderRadius: 5,
        // paddingBottom: 5,
        width: 100,
        borderColor: 'black',
        backgroundColor: '#f08080',
        borderWidth: 2,
        // elevation: 2,
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    photo: {
        height: 170,
        width: 170,
        borderRadius: 10
    },
});

export default ItemsListViewUsers;