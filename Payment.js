import React, { useState, createRef, useEffect, useRef } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Linking,
    Text,
    ScrollView,
    Alert,
    Image,
    Button,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    Pressable,
    FlatList,
} from "react-native";

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';

import { normalize } from "./FontResize";
import ActivityIndicatorElement from "./ActivityIndicatorElement";
import { AntDesign, Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { NotificationHandler } from "./NotificationHandler";


const PaymentGateway = ({ navigation, route }) => {
    // setData, totalamount, route.params.AllConfirmedItems, route.params.OrderId, route.params.displayCurrentAddress, setDisplayCurrentAddress, route.params.longitude, setroute.params.longitude, route.params.latitude, setroute.params.latitude 

    const [paymentDone, setpaymentDone] = useState(false);

    const [loading, setloading] = useState(false);

    const Ref = useRef(null);

    const [timer, setTimer] = useState();


    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }


    const startTimer = (e) => {
        let { total, hours, minutes, seconds } = getTimeRemaining(e);

        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds) + 's'
            )
        }
    }


    const clearTimer = (e) => {

        setTimer('10:00s');

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 10 * 60);
        return deadline;
    }

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    useEffect(() => {
        // setVisible(false)
        try {
            var address = 'Detecting Location';
            var addressNextLine = ''

            if (route.params.displayCurrentAddress) {
                address = '';
                var addressDetails = route.params.displayCurrentAddress.split(',')
                let i = 0;

                for (i = addressDetails.length - 1; i > addressDetails.length - 3; i--) {
                    if (i !== addressDetails.length - 1) {
                        addressNextLine = addressDetails[i] + addressNextLine
                    }
                    else {
                        addressNextLine = ',' + addressDetails[i] + addressNextLine
                    }
                }
                addressNextLine = addressNextLine.trim();

                for (let j = 0; j <= i; j++) {
                    if (j !== 0) {
                        address += ',' + addressDetails[j]
                    }
                    else {
                        address += addressDetails[j]
                    }
                }
                address = address.trim()
            }

            //    const phoneNumber = auth.currentUser.phoneNumber.slice(0, 3) + ' ' + auth.currentUser.phoneNumber.slice(3);
            navigation.setOptions({
                headerShown: true,
                headerLeft: () => <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                }}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Ionicons name="arrow-back-sharp" size={normalize(21)} color="white"
                            onPress={() => {
                                navigation.pop(2);
                            }} />
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Ionicons name="ios-location-sharp" size={normalize(17)} color="#D41636" onPress={() => {
                            Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                                {
                                    text: 'Want to change?',
                                    onPress: () => navigation.pop(2),
                                    style: 'cancel',
                                },
                                {
                                    text: 'want to proceed'
                                }
                            ])
                        }} />
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingHorizontal: scale(3)
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{
                                    fontWeight: '600',
                                    fontSize: normalize(14),
                                    color: 'white',
                                }}
                                    onPress={() => {
                                        Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                                            {
                                                text: 'Want to change?',
                                                onPress: () => navigation.pop(2),
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'want to proceed'
                                            }
                                        ])
                                    }}
                                >{address}</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}>
                            <Text style={{ fontSize: normalize(10), color: 'white', }} onPress={() => {
                                Alert.alert('Delivery Location', `${route.params.displayCurrentAddress}`, [
                                    {
                                        text: 'Want to change?',
                                        onPress: () => navigation.pop(2),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'want to proceed'
                                    }
                                ])
                            }} >{addressNextLine}</Text>
                        </View>

                    </View>
                </View>,
                title: '',
                headerStyle: {
                    backgroundColor: '#5C7197',
                },
                // headerTintColor: '#fff',
                //   headerTitleStyle: {
                //       fontSize: normalize(13),
                //       fontWeight: '600',
                //       color: 'black'
                //   },
                headerRight: () => (
                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'column',
                        // backgroundColor: '#8931B8',
                        backgroundColor: '#5C7197',
                        // height: verticalScale(40),
                        padding: scale(10),
                        borderRadius: scale(6),
                        // borderTopColor: 'white',
                        // borderTopWidth: scale(0.6)
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                            {timer === '00:00s' ? (
                                // NotificationHandler(auth.currentUser.phoneNumber,`Order Not Placed ❌🙁 Order Id: ${route.params.OrderId}`, `Payment gateway expired, Please Re-order and GetIt.`),
                                Alert.alert('Order Not Confirmed', `Payment gateway expired, Please Re-order and GetIt.`, [
                                    {
                                        text: 'Ok',
                                        onPress: () => navigation.pop(1),
                                        style: 'cancel',
                                    },
                                ]))
                                : undefined}
                            <View>
                                <MaterialIcons name="timer" size={normalize(16)} color="#F4C034" />
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                marginLeft: scale(2)
                            }}>
                                <Text style={{
                                    fontSize: normalize(12),
                                    color: timer <= "00:10" ? '#F13445' : '#F4C034',
                                    fontWeight: '500',
                                    letterSpacing: scale(0.4),
                                }}>{timer}</Text>
                            </View>
                        </View>

                    </View>
                ),

            })
        }
        catch (error) {
            // setloading(false)
            setUser({ loggedIn: false })
        }
    }, [route.params.displayCurrentAddress, timer])

    const openPaymentApp = async (paymentMode) => {

        setloading(true)

        try {
            let url = `upi://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${route.params.totalamount}&cu=INR`;

            paymentMode === 'online' ? await Linking.openURL(url) : false;

            for (var i = 0; i < route.params.AllConfirmedItems.length; i++) {

                update(ref(database, `users/${auth.currentUser.phoneNumber}/orders/${route.params.OrderId}/items/${route.params.AllConfirmedItems[i]["ItemCategory"]}/` + route.params.AllConfirmedItems[i]["key"]), {
                    ItemId: route.params.AllConfirmedItems[i]["key"],
                    ItemName: route.params.AllConfirmedItems[i]["ItemName"],
                    ItemPrice: route.params.AllConfirmedItems[i]["ItemPrice"],
                    ItemDesc: route.params.AllConfirmedItems[i]["ItemDesc"],
                    ItemImage: route.params.AllConfirmedItems[i]["ItemImage"],
                    ItemCategory: route.params.AllConfirmedItems[i]["ItemCategory"],
                    ItemQuantity: route.params.AllConfirmedItems[i]["ItemQuantity"],
                    ItemAddedDate: route.params.AllConfirmedItems[i]["ItemAddedDate"],
                });
            }

            set(ref(database, `users/${auth.currentUser.phoneNumber}/orders/${route.params.OrderId}/orderDetails`), {
                Location: route.params.displayCurrentAddress,
                Longitude: route.params.longitude,
                Latitude: route.params.latitude,
                phoneNumber: auth.currentUser.phoneNumber,
                OrderId: route.params.OrderId
            })

            set(ref(database, `users/${auth.currentUser.phoneNumber}/orders/${route.params.OrderId}/orderStatus`), {
                OrderStatus: -1
            })

            setloading(false)

            // await NotificationHandler(auth.currentUser.phoneNumber, `Order Placed ✅🎊 Order Id: ${route.params.OrderId}`, `Delivery Location : ${route.params.displayCurrentAddress}`)
            // await NotificationHandler(auth.currentUser.phoneNumber, `Thank you 🤩❤️`, `Please collect your order from our delivery agent.`)

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { disableNotification: true } }],
            });
        }
        catch (err) {
            setloading(false)
            Alert.alert(err);
            console.error('ERROR : ', err);
        }
    }

    const Item = ({ index, Id, ItemName, ItemDesc, ItemImage, ItemPrice, ItemCategory, ItemQuantity }) => (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            // justifyContent: 'center',
            borderBottomWidth: scale(0.9),
            backgroundColor: (index % 2) ? "#D6D3D3" : "#fff",
            padding: scale(15)
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    // borderWidth: scale(1)
                }}>
                    <Image source={{ uri: ItemImage }} style={styles.photo}
                    />
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontSize: normalize(13),
                                letterSpacing: scale(0.2),
                                fontWeight: '500'
                            }}>{ItemName}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontSize: normalize(10),
                                fontStyle: 'italic',
                                letterSpacing: scale(0.2)
                            }}>
                                {ItemDesc}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: normalize(12),
                            letterSpacing: scale(0.2)
                        }}>
                            {ItemCategory}
                        </Text>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <Text style={{
                            fontSize: normalize(13),
                            letterSpacing: scale(0.2),
                            fontWeight: '500'
                        }}>
                            ₹{ItemPrice}
                        </Text>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <Text style={{
                            fontSize: normalize(13),
                            letterSpacing: scale(0.2)
                        }}>{ItemQuantity} qty</Text>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <Text style={{
                            fontSize: normalize(13),
                            letterSpacing: scale(0.2),
                            fontWeight: '500'
                        }}>₹{ItemPrice * ItemQuantity}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item, index }) => {
        return (
            <Item
                index={index}
                Id={item.key}
                ItemName={item.ItemName}
                ItemImage={item.ItemImage}
                ItemDesc={item.ItemDesc}
                ItemPrice={item.ItemPrice}
                ItemCategory={item.ItemCategory}
                ItemQuantity={item.ItemQuantity}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ActivityIndicatorElement loading={loading} />
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}>
                <View style={{
                    // flex: 0.13,
                    flexDirection: 'row',
                    // justifyContent: 'space-between',

                    padding: scale(10),
                    borderBottomWidth: scale(0.5),
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontSize: normalize(15),
                                fontWeight: '400',
                            }}>
                                Order Summary
                            </Text>
                        </View>
                    </View>
                </View>

                {
                    route.params.AllConfirmedItems.length !== 0 ?

                        <FlatList
                            data={route.params.AllConfirmedItems}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index)}
                        />
                        :
                        <></>
                }

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: scale(0.8),
                    paddingVertical: scale(10),
                    paddingHorizontal: scale(13),
                    backgroundColor: '#D74E67',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                 fontSize: normalize(16),
                                 color: '#fff',
                                 fontWeight: '500',
                                 letterSpacing: scale(0.3)
                            }}>{route.params.AllConfirmedItems.length} items</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>

                            <Text style={{
                                fontSize: normalize(16),
                                color: '#fff',
                                fontWeight: '500',
                                letterSpacing: scale(0.3)
                            }}
                            >Total: ₹{route.params.totalamount}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginHorizontal: scale(10),
                    marginVertical: scale(5),
                   
                }}>
                    <View style={{
                        justifyContent: 'center',
                        marginRight: scale(2)
                    }}>
                        <Ionicons name="information-circle-outline" size={normalize(16)} color="#FB3951" />
                    </View>
                    <View style={{
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: 'red'
                        }}>Only cash on delivery is avaliable.</Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderTopWidth: scale(0.7)
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        // borderWidth: scale(0.8),
                        paddingVertical: scale(10),
                        paddingHorizontal: scale(13),
                        backgroundColor: '#706F71',
                    }}>
                        <Pressable
                            onPress={
                                // () => openPaymentApp('online')
                                () => Alert.alert("Work in progress", "Only cash on delivery is avaliable")}
                            disabled={true}
                        >
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly'
                            }}>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <SimpleLineIcons name="ban" size={normalize(14)} color="#EA0404" />
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: normalize(16),
                                        color: '#C6C6C6',
                                        fontWeight: '500',
                                        letterSpacing: scale(0.3)
                                    }}>PAY ONLINE</Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        // borderWidth: scale(0.8),
                        borderLeftWidth: scale(0.7),
                        paddingVertical: scale(10),
                        paddingHorizontal: scale(13),
                        backgroundColor: '#676EB4',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                            <Pressable onPress={() => openPaymentApp('offline')} >
                                <Text style={{
                                    fontSize: normalize(16),
                                    color: '#fff',
                                    fontWeight: '500',
                                    letterSpacing: scale(0.3)
                                }}
                                >CASH ON DELIVERY
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>


            </View>
        </SafeAreaView>

    );

}

export default PaymentGateway;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    button: {
        // paddingVertical: verticalScale(7),
        // paddingHorizontal: scale(30),
        borderRadius: scale(4),
        elevation: scale(18),
        // backgroundColor: 'black',
    },
    text: {
        fontSize: normalize(14),
        lineHeight: scale(18),
        fontWeight: 'bold',
        letterSpacing: scale(0.75),
        color: 'white',
    },
    photo: {
        height: verticalScale(30),
        width: scale(30),
        borderRadius: scale(4)
    },
})













// switch (payApp) {
//     "upi://pay?pa=9480527929@oksbi&amp;pn=FNAME SNAME K&amp;cu=INR"
//     case 'PAYTM': url = `paytmmp://pay?pa=9880737456@paytm&pn=Rakshit Kulkarni&tn=Note&am=1&cu=INR`; break;
//     case 'GPAY': url = `tez://upi/pay?pa=rakshitkulkarni2002@oksbi&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
//     case 'PHONEPE': url = `phonepe://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
// }