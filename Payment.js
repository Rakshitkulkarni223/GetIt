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
} from "react-native";

import { app, auth, db, database } from "./Firebase";
import { ref, set, update, onValue } from "firebase/database";


const PaymentGateway = ({ navigation, route,totalamount, AllConfirmedItems, OrderId, displayCurrentAddress, setDisplayCurrentAddress }) => {


    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            e.preventDefault();
        });
        return unsubscribe;
    }, [navigation]);

    const openPaymentApp = async (paymentMode) => {

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
                    AuthId: auth.currentUser.uid,
                    OrderId: OrderId,
                    OrderConfirmed: true,
                    OrderPending: true,
                    OrderDelivered: false
                });
            }

            set(ref(database, `users/orders/${OrderId}/items/`), {
            })

            navigation.navigate("Home");
        }
        catch (err) {
            alert(err);
            console.error('ERROR : ', err);
        }
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Button title='PAY ONLINE' onPress={() => openPaymentApp('online')} />
            <Text>Or</Text>
            <Button title='Cash on Delivery' onPress={() => openPaymentApp('offline')} />
        </View>

    );

}

export default PaymentGateway;













// switch (payApp) {
//     "upi://pay?pa=9480527929@oksbi&amp;pn=FNAME SNAME K&amp;cu=INR"
//     case 'PAYTM': url = `paytmmp://pay?pa=9880737456@paytm&pn=Rakshit Kulkarni&tn=Note&am=1&cu=INR`; break;
//     case 'GPAY': url = `tez://upi/pay?pa=rakshitkulkarni2002@oksbi&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
//     case 'PHONEPE': url = `phonepe://pay?pa=9480527929@ybl&pn=Rakshit Kulkarni&tn=Note&am=${totalamount}&cu=INR`; break;
// }