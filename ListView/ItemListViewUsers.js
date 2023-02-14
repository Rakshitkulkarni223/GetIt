import React, { useState, useEffect, createRef } from 'react';
import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity, Alert, TextInput, Keyboard, ActivityIndicator, Modal } from 'react-native';
import { AntDesign, EvilIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { app, auth, db, database } from "../Firebase";
import { onValue, ref, set, update } from "firebase/database";

import { scale, moderateScale, verticalScale } from '../Dimensions';

import { normalize } from '../FontResize';
import ActivityIndicatorElement from '../ActivityIndicatorElement';



const Item = ({ setloading, index, setItemId, avgRating, totalUsers, UserRating, TotalRating, RateItem, setItemCategory, showfooter, handleIncrease, qtyhandlervisible, handleDecrease, setItemName, setItemImage, setItemDesc, setItemPrice, id, ItemQuantity, title, image_url, price, description, category, displaycategory, setratingOne, ratingOne, setratingTwo, ratingTwo, setratingThree, ratingThree, setratingFour, ratingFour, setratingFive, ratingFive }) => (
    <>{displaycategory ? <Text style={{
        fontSize: normalize(13),
        fontWeight: "600",
        marginLeft: scale(15),
        marginTop: scale(10),
        color: 'black',
        letterSpacing: scale(0.5),
        paddingRight: scale(15),
    }}>{category.toUpperCase()}</Text> : <></>}
        <View>

            <View style={[styles.container,
            { paddingBottom: showfooter ? verticalScale(10) : verticalScale(18) }]}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingRight: scale(8),
                }}>
                    <View>
                        <Text style={styles.title_item}>
                            {title.toUpperCase()}
                        </Text>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                    }}>
                        {
                            avgRating === 0 ?
                                <FontAwesome
                                    name='star-o'
                                    size={normalize(15)}
                                    color="black"
                                // style={{ paddingLeft: scale(1) }}
                                />
                                :
                                <FontAwesome
                                    name='star'
                                    size={normalize(15)}
                                    color="#f1c40f"
                                // style={{ paddingLeft: scale(1) }}
                                />
                        }
                        <Text style={{
                            paddingLeft: scale(2),
                            textAlignVertical: 'center'
                        }}>
                            <Text style={{
                                fontWeight: '600'
                            }}>{avgRating}/5, </Text>
                            <Text style={{
                                fontWeight: '400'
                            }}>{totalUsers}</Text>
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                    }}>
                        {/* <FontAwesome name="rupee" size={normalize(15)} color="black" /> */}
                        <Text style={styles.title_price}>
                            ₹{price}
                        </Text>
                    </View>
                    {ItemQuantity * price > 0 ?
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            {/* <FontAwesome name="rupee" size={normalize(18)} color="black" style={{ paddingTop: scale(12), }} /> */}
                            <Text style={styles.total_item_price}>
                                ₹{ItemQuantity * price}
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
                    {showfooter ?

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    marginTop: verticalScale(20),
                                    marginBottom: verticalScale(2),
                                }}>
                                    <FontAwesome
                                        name={ratingOne}
                                        size={normalize(15)}
                                        color={ratingOne === 'star-o' ? "black" : "#f1c40f"}
                                        onPress={() => {
                                            RateItem(index, 1)
                                        }}
                                    />
                                    <FontAwesome
                                        name={ratingTwo}
                                        size={normalize(15)}
                                        color={ratingTwo === 'star-o' ? "black" : "#f1c40f"}
                                        onPress={() => {
                                            RateItem(index, 2)
                                        }}
                                        style={{ paddingLeft: scale(1) }}
                                    />
                                    <FontAwesome
                                        name={ratingThree}
                                        size={normalize(15)}
                                        color={ratingThree === 'star-o' ? "black" : "#f1c40f"}
                                        onPress={() => {
                                            RateItem(index, 3)
                                        }}
                                        style={{ paddingLeft: scale(1) }}
                                    />
                                    <FontAwesome
                                        name={ratingFour}
                                        size={normalize(15)}
                                        color={ratingFour === 'star-o' ? "black" : "#f1c40f"}
                                        onPress={() => {
                                            RateItem(index, 4)
                                        }}
                                        style={{ paddingLeft: scale(1) }}
                                    />
                                    <FontAwesome
                                        name={ratingFive}
                                        size={normalize(15)}
                                        color={ratingFive === 'star-o' ? "black" : "#f1c40f"}
                                        onPress={() => {
                                            RateItem(index, 5)
                                        }}
                                        style={{
                                            paddingLeft: scale(1),
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingRight: scale(2),
                            }}>
                                <Text>Rate </Text>
                                <Text style={{ fontWeight: '600' }}>{title}</Text>
                            </View>
                        </View> : <></>}

                    <View style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        marginTop: verticalScale(115),
                        borderWidth: scale(1),
                        height: scale(22),
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
                                            // justifyContent: 'center',
                                            // position: 'absolute',
                                            // marginTop: verticalScale(115),
                                            // borderWidth: scale(1),
                                            // height: scale(22),
                                            // marginLeft: scale(38),
                                            // width: scale(80),
                                            // borderColor: 'black',
                                            // backgroundColor: 'white',
                                            // borderWidth: scale(0.5),
                                            // borderRadius: scale(5),
                                            // elevation: scale(10),
                                        }}
                                    >
                                        <View style={{ 
                                            justifyContent: 'center', 
                                            flex: 1, 
                                            backgroundColor: '#5324A6',
                                            borderTopLeftRadius: scale(4),
                                            borderBottomLeftRadius: scale(4)
                                        }}
                                        >
                                            <AntDesign name="minus" size={scale(20)} color="white"
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
                                                        backgroundColor: '#fff',
                                                        // borderLeftWidth: scale(0.5),
                                                        // borderRightWidth: scale(0.5),
                                                        color: "black",
                                                        textAlign: 'center',
                                                        textAlignVertical: 'center',
                                                    }
                                                ]
                                            }>{ItemQuantity}</Text>
                                        </View>

                                        <View style={{ 
                                            justifyContent: 'center', 
                                            flex: 1, 
                                            alignItems: 'center',
                                            borderTopRightRadius: scale(4),
                                            borderBottomRightRadius: scale(4),
                                            backgroundColor: '#5324A6',
                                        }}
                                        >
                                            <Ionicons name="md-add-outline" size={scale(20)} color="white"
                                                onPress={() => handleIncrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{
                                        flexDirection: 'row',
                                        // justifyContent: 'space-around'
                                    }}>
                                        <View style={{
                                            marginRight: scale(10),
                                            // borderWidth: scale(1),
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{
                                                textAlignVertical: 'center',
                                                textAlign: 'center',
                                                color: "black",
                                                fontSize: normalize(15),
                                                fontWeight: "600",
                                                letterSpacing: scale(0.4),
                                            }} onPress={() => handleIncrease(index)}>Add</Text>
                                        </View>
                                        <View style={{
                                            //  flex: 1, 
                                            // justifyContent: 'center',
                                            // alignItems: 'center',
                                            // marginRight: scale(3),
                                            paddingLeft: scale(2.5),
                                            paddingRight: scale(3),
                                            borderTopRightRadius: scale(4),
                                            borderBottomRightRadius: scale(4),
                                            // alignItems: 'center',
                                            backgroundColor: '#5324A6',
                                            borderLeftWidth: scale(0.6),
                                            // backgroundColor: '#852FD2'
                                        }}>
                                            <Ionicons name="md-add-outline" size={scale(20)} color="white"
                                                onPress={() => handleIncrease(index)}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </View>

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


const ItemsListViewUsers = ({ navigation, DATA, OrderId, qtyhandler, showfooter, totalamount, settotalamount, loading, setloading, displayCurrentAddress, totalConfirmedItems, longitude, latitude }) => {

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

    const [totalItems, settotalItems] = useState(0);

    useEffect(() => {
        if (loading) {
            setloading(false)
        }
        if (loading && data.length === 0) {
            setloading(true)
        }
    }, [loading])

    useEffect(() => {
        setQuery('');
        if (searchRef && searchRef.current) {
            searchRef.current.clear()
        }
        setloading(false);

        setData(DATA)
    }, [DATA])

    const RateItem = async (index, ratingByUser) => {
        const temp = data;
        var id = data[index].key;

        // var previousRating = temp[index].UserRating;

        // var deleteRating = false;

        if (ratingByUser === 1 && temp[index].ratingOne === 'star') {
            temp[index].ratingOne = 'star-o'
            temp[index].ratingTwo = 'star-o'
            temp[index].ratingThree = 'star-o'
            temp[index].ratingFour = 'star-o'
            temp[index].ratingFive = 'star-o'
            temp[index].UserRating = ratingByUser;
        }
        if (ratingByUser === 1 && temp[index].ratingOne === 'star-o') {
            if (temp[index].UserRating === 0) {
                temp[index].UserRating = ratingByUser;
                temp[index].ratingOne = 'star'
            }
            else {
                temp[index].UserRating = 0;
                // deleteRating = true;
            }
        }

        if (ratingByUser === 2 && temp[index].ratingTwo === 'star') {
            temp[index].ratingTwo = 'star-o'
            temp[index].ratingThree = 'star-o'
            temp[index].ratingFour = 'star-o'
            temp[index].ratingFive = 'star-o'
            temp[index].UserRating = ratingByUser;
        }
        if (ratingByUser === 2 && temp[index].ratingTwo === 'star-o') {
            temp[index].ratingOne = 'star'
            temp[index].ratingTwo = 'star'
            temp[index].UserRating = ratingByUser;
        }

        if (ratingByUser === 3 && temp[index].ratingThree === 'star') {
            temp[index].ratingThree = 'star-o'
            temp[index].ratingFour = 'star-o'
            temp[index].ratingFive = 'star-o'
            temp[index].UserRating = ratingByUser;
        }
        if (ratingByUser === 3 && temp[index].ratingThree === 'star-o') {
            temp[index].ratingOne = 'star'
            temp[index].ratingTwo = 'star'
            temp[index].ratingThree = 'star'
            temp[index].UserRating = ratingByUser;
        }

        if (ratingByUser === 4 && temp[index].ratingFour === 'star') {
            temp[index].ratingFour = 'star-o'
            temp[index].ratingFive = 'star-o'
            temp[index].UserRating = ratingByUser;
        }
        if (ratingByUser === 4 && temp[index].ratingFour === 'star-o') {
            temp[index].ratingOne = 'star'
            temp[index].ratingTwo = 'star'
            temp[index].ratingThree = 'star'
            temp[index].ratingFour = 'star'
            temp[index].UserRating = ratingByUser;
        }

        if (ratingByUser === 5 && temp[index].ratingFive === 'star') {
            temp[index].ratingFive = 'star-o'
            temp[index].UserRating = ratingByUser;
        }
        if (ratingByUser === 5 && temp[index].ratingFive === 'star-o') {
            temp[index].ratingOne = 'star'
            temp[index].ratingTwo = 'star'
            temp[index].ratingThree = 'star'
            temp[index].ratingFour = 'star'
            temp[index].ratingFive = 'star'
            temp[index].UserRating = ratingByUser;
        }

        set(ref(database, `userRatings/${auth.currentUser.phoneNumber}/${id}/`), {
            rating: temp[index].UserRating
        })

        var allrating = 0;

        var totalusers = 0

        onValue(ref(database, `userRatings/`), (snapshot) => {
            snapshot.forEach((child) => {
                allrating += child.val()[id]["rating"]
                if (child.val()[id]["rating"] !== 0) {
                    totalusers += 1;
                    // console.log(child.val()[id]["rating"])
                }
            })

            temp[index].TotalRating = allrating;
            temp[index].totalUsers = totalusers;

            temp[index].avgRating = totalusers === 0 ? 0 : Math.round(allrating / totalusers * 100) / 100

            update(ref(database, `adminItemRatings/${id}/`), {
                Rating: allrating,
                TotalUsers: totalusers
            });

            setData(temp)
            setRefresh(Math.random());
        })

        // if (temp[index].RatedBefore) {
        //     if(deleteRating)
        //     {
        //         console.log(deleteRating)
        //         set(ref(database, `adminItemRatings/${id}/`), {
        //             Rating: temp[index].TotalRating + (temp[index].UserRating-previousRating),
        //             TotalUsers: temp[index].totalUsers - 1
        //         });
        //     }
        //     if(!deleteRating)
        //     {
        //         set(ref(database, `adminItemRatings/${id}/`), {
        //             Rating: temp[index].TotalRating + (temp[index].UserRating-previousRating),
        //             TotalUsers: temp[index].totalUsers 
        //         });
        //     }

        // }
        // if (!temp[index].RatedBefore) {
        //     set(ref(database, `adminItemRatings/${id}/`), {
        //         Rating:  temp[index].TotalRating + ratingByUser,
        //         TotalUsers: temp[index].totalUsers + 1
        //     });
        //     temp[index].RatedBefore = true;
        // }

        // onValue(ref(database, `adminItemRatings/${id}/`), (snapshot) => {
        //     if (snapshot.exists()) {
        //         temp[index].TotalRating = snapshot.val()["Rating"]
        //         temp[index].totalUsers = snapshot.val()["TotalUsers"]
        //     }
        // })


    }

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

        if (temp[index].ItemQuantity === 1) {
            settotalItems(totalItems + 1)
        }

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

        if (temp[index].ItemQuantity === 0) {
            settotalItems(totalItems - 1)
        }


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
            ratingOne={item.ratingOne}
            ratingTwo={item.ratingTwo}
            ratingThree={item.ratingThree}
            ratingFour={item.ratingFour}
            ratingFive={item.ratingFive}
            RateItem={RateItem}
            totalUsers={item.totalUsers}
            TotalRating={item.TotalRating}
            UserRating={item.UserRating}
            avgRating={item.avgRating}
        />
    );

    const checkcart = () => {

        if (showfooter) {
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
                console.log(displayCurrentAddress)
                if (displayCurrentAddress) {
                    navigation.navigate("Confirm Order",
                        {
                            OrderId: OrderId,
                            displayCurrentAddress: displayCurrentAddress,
                            totalItems: totalItems,
                            longitude: longitude,
                            latitude: latitude
                        }
                    )
                }
                else {
                    Alert.alert('Location Not Found', `Please select/add location for next step`, [
                        {
                            text: 'OK',
                        },
                    ])
                }

            }
        }
        else {

            navigation.navigate("Payment Gateway",
                {
                    totalamount: totalamount,
                    AllConfirmedItems: DATA,
                    OrderId: OrderId,
                    displayCurrentAddress: displayCurrentAddress,
                    totalItems: totalItems,
                    longitude: longitude,
                    latitude: latitude
                }
            )
        }

    }


    return (
        <>
            <ActivityIndicatorElement loading={loading} />

            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#fff',
                // backgroundColor: 'white'
            }}>
                {
                    DATA.length !== 0 ?
                        <SafeAreaView style={{
                            flex: 1,
                            backgroundColor: '#3B3636',
                            backgroundColor: '#EAEAEA'
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



                            {(totalamount !== 0) ?
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    backgroundColor: !showfooter ? '#7526B8' : '#546CB8',
                                    height: verticalScale(40),
                                    borderTopColor: 'white',
                                    borderTopWidth: scale(0.6)
                                }}>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'column',
                                            // justifyContent: 'flex-start'
                                        }}>
                                            <Text style={{
                                                fontSize: normalize(10),
                                                paddingHorizontal: scale(15),
                                                color: !showfooter ? 'white' : 'white',
                                                // fontWeight: '600',
                                                letterSpacing: scale(0.4),
                                                fontFamily: 'sans-serif-medium'
                                            }}>
                                                {showfooter ? totalItems : totalConfirmedItems} items
                                            </Text>
                                            <Text style={{
                                                fontSize: normalize(15),
                                                paddingHorizontal: scale(15),
                                                color: !showfooter ? 'white' : 'white',
                                                fontWeight: '600',
                                                letterSpacing: scale(0.4),
                                            }} >₹{totalamount}</Text></View>
                                    </View>

                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            paddingHorizontal: scale(20)
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderWidth: scale(0.6),
                                            borderRadius: scale(5),
                                            backgroundColor: 'white',
                                            borderColor: 'white',
                                            paddingVertical: verticalScale(4),
                                            paddingHorizontal: scale(10)
                                        }}>
                                            <TouchableOpacity onPress={checkcart}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center'
                                                }}>
                                                    <View style={{
                                                        justifyContent: 'center',

                                                    }}>
                                                        <Text style={{
                                                            textAlign: 'center',
                                                            fontSize: normalize(15),
                                                            color: showfooter ? 'black' : '#D34386',
                                                            fontWeight: '600',
                                                            letterSpacing: scale(0.4),
                                                            fontFamily: 'sans-serif-medium'
                                                        }} > {showfooter ? "View Cart" : "Pay and GetIt"}
                                                        </Text>
                                                    </View>
                                                    <View style={{
                                                        justifyContent: 'center',
                                                        paddingLeft: scale(5)
                                                    }}>
                                                        <AntDesign name="caretright" size={normalize(10)}
                                                            color={showfooter ? "black" : '#D34386'} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        // paddingBottom: scale(15),
        marginLeft: scale(15),
        marginRight: scale(15),
        marginTop: scale(8),
        marginBottom: scale(9),
        marginVertical: verticalScale(0),
        borderRadius: scale(8),
        // borderBottomWidth: scale(1),
        // borderLeftWidth: scale(1),
        borderWidth: scale(0.9),
        // borderBottomColor: '#000',
        backgroundColor: '#ffe4e1',
        backgroundColor: '#BDF3CB',
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
        fontSize: normalize(18),
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