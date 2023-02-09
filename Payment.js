import React, { useState, createRef, useEffect } from "react";
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
} from "react-native";

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";

import { scale, moderateScale, verticalScale } from './Dimensions';

import { normalize } from "./FontResize";
import ActivityIndicatorElement from "./ActivityIndicatorElement";


const PaymentGateway = ({ navigation, route, setData, totalamount, AllConfirmedItems, OrderId, displayCurrentAddress, setDisplayCurrentAddress, longitude, setlongitude, latitude, setlatitude }) => {

    const [paymentDone, setpaymentDone] = useState(false);

    const [loading, setloading] = useState(false);

    useEffect(() => {
        setloading(true)
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            e.preventDefault();
        });

        setloading(false)
        return unsubscribe;
    }, [navigation]);

    const openPaymentApp = async (paymentMode) => {

        setloading(true)

        try {
            let url = `upi://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`;

            paymentMode === 'online' ? await Linking.openURL(url) : false;

            for (var i = 0; i < AllConfirmedItems.length; i++) {
                set(ref(database, `users/confirmedOrders/${OrderId}/items/${AllConfirmedItems[i]["ItemCategory"]}/` + AllConfirmedItems[i]["key"]), {
                    ItemId: AllConfirmedItems[i]["key"],
                    ItemName: AllConfirmedItems[i]["ItemName"],
                    ItemPrice: AllConfirmedItems[i]["ItemPrice"],
                    ItemDesc: AllConfirmedItems[i]["ItemDesc"],
                    ItemImage: AllConfirmedItems[i]["ItemImage"],
                    ItemCategory: AllConfirmedItems[i]["ItemCategory"],
                    ItemQuantity: AllConfirmedItems[i]["ItemQuantity"],
                    ItemAddedDate: AllConfirmedItems[i]["ItemAddedDate"],
                    Location: displayCurrentAddress,
                    phoneNumber: auth.currentUser.phoneNumber,
                    Longitude: longitude,
                    Latitude: latitude,
                    OrderId: OrderId,
                    OrderConfirmed: true,
                    OrderPending: true,
                    OrderDelivered: false
                });


                set(ref(database, `users/userpendingOrders/${auth.currentUser.phoneNumber}/${OrderId}/items/${AllConfirmedItems[i]["ItemCategory"]}/` + AllConfirmedItems[i]["key"]), {
                    ItemId: AllConfirmedItems[i]["key"],
                    ItemName: AllConfirmedItems[i]["ItemName"],
                    ItemPrice: AllConfirmedItems[i]["ItemPrice"],
                    ItemDesc: AllConfirmedItems[i]["ItemDesc"],
                    ItemImage: AllConfirmedItems[i]["ItemImage"],
                    ItemCategory: AllConfirmedItems[i]["ItemCategory"],
                    ItemQuantity: AllConfirmedItems[i]["ItemQuantity"],
                    ItemAddedDate: AllConfirmedItems[i]["ItemAddedDate"],
                    Location: displayCurrentAddress,
                    phoneNumber: auth.currentUser.phoneNumber,
                    Longitude: longitude,
                    Latitude: latitude,
                    OrderId: OrderId,
                    OrderConfirmed: true,
                    OrderPending: true,
                    OrderDelivered: false
                });
            }

            await set(ref(database, `users/orders/${OrderId}/items/`), {
            })

            setloading(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
        catch (err) {
            setloading(false)
            Alert.alert(err);
            console.error('ERROR : ', err);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ActivityIndicatorElement loading={loading} />
            
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                // margin: scale(25),
            }}>

                <View style={{ margin: scale(10), }}>
                    <Pressable style={styles.button} 
                    onPress={
                        // () => openPaymentApp('online')
                        () => Alert.alert("Work in progress", "Only cash on delivery is avaliable")}
                    disabled={true}
                    >
                        <Text style={styles.text}>PAY ONLINE</Text>
                    </Pressable>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: 'black', fontWeight: 'bold', letterSpacing: scale(0.3),
                        marginBottom: verticalScale(10),
                        marginTop: verticalScale(10)
                    }}>OR</Text>
                </View>

                <View style={{ margin: scale(10), }}>
                    <Pressable style={[styles.button,  { backgroundColor : '#706F71'}]} onPress={() => openPaymentApp('offline')} >
                        <Text style={styles.text}>CASH ON DELIVERY</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>

    );

}

export default PaymentGateway;



const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(30),
        borderRadius: scale(4),
        elevation: scale(18),
        backgroundColor: 'black',
    },
    text: {
        fontSize: normalize(14),
        lineHeight: scale(18),
        fontWeight: 'bold',
        letterSpacing: scale(0.75),
        color: 'white',
    },
})













// switch (payApp) {
//     "upi://pay?pa=9480527929@oksbi&amp;pn=FNAME SNAME K&amp;cu=INR"
//     case 'PAYTM': url = `paytmmp://pay?pa=9880737456@paytm&pn=Rakshit Kulkarni&tn=Note&am=1&cu=INR`; break;
//     case 'GPAY': url = `tez://upi/pay?pa=rakshitkulkarni2002@oksbi&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
//     case 'PHONEPE': url = `phonepe://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
// }