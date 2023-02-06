import React, { useEffect, useState } from 'react';
import { Modal,SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ItemsListViewConfirmedOrders from '../ListView/ItemsListViewConfirmedOrders';
import ActivityIndicatorElement from '../ActivityIndicatorElement';



const ConfirmedOrders = () => {

   const [AllItems, setAllItems] = useState([]);

   const [AllOrders, setAllOrders] = useState([]);

   const [toggle, settoggle] = useState(false);


   const [itemsList, setitemsList] = useState(ref(database, 'admin/confirmedOrdersByAdmin/'));

   const [loading, setloading] = useState(false);



   useEffect(() => {

      setloading(true);

      const getitems = onValue(itemsList, (snapshot) => {


         var items = [];
         var orders = [];

         var data = [];

         var flag = true;
         var showuser = true;
         snapshot.forEach((child) => {

            showuser = true;
            var totalamount = 0;
            items = [];
            var Location = '';
            var phoneNumber = '';
            var Longitude = '';


            var Latitude = ''
            var date = ''
            child.forEach((it) => {
               it.forEach((item) => {
                  flag = true;
                  item.forEach((eachitem) => {

                     totalamount += eachitem.val().ItemPrice * eachitem.val().ItemQuantity;

                     Location = eachitem.val().Location;
                     Longitude = eachitem.val().Longitude;
                     Latitude = eachitem.val().Latitude;

                     phoneNumber = eachitem.val().phoneNumber;

                     date = eachitem.val().ItemAddedDate;
                  

                     items.push({
                        key: eachitem.key,
                        ItemCategory: item.key,
                        displayCategory: flag,
                        displayUser: showuser,
                        OrderId: child.key,
                        phoneNumber: eachitem.val().phoneNumber,
                        ItemName: eachitem.val().ItemName,
                        ItemDesc: eachitem.val().ItemDesc,
                        ItemCategory: eachitem.val().ItemCategory,
                        ItemPrice: eachitem.val().ItemPrice,
                        ItemImage: eachitem.val().ItemImage,
                        ItemQuantity: eachitem.val().ItemQuantity,
                        ItemAddedDate: eachitem.val().ItemAddedDate
                     })
                     showuser = false;
                     flag = false;
                     // AuthId = eachitem.val().AuthId;
                  })
               })
            })
            data = items;
            orders.push({
               key: child.key, value: data, toggle: false,
               totalamount: totalamount, Location: Location
               , Longitude: Longitude, Latitude: Latitude,
               phoneNumber: phoneNumber,
               Date: date
            });
         })


         orders.sort(function (item1, item2) {
            var val1 = new Date(item1['Date']);
            var val2 = new Date(item2['Date']);
            if (val1 < val2) return 1;
            if (val1 > val2) return -1;
            return 0;
         });

         setloading(false);
         setAllItems(items);
         setAllOrders(orders);

      });

      return () => {
         getitems();
      }

   }, [])

   return (

      <>
      <ActivityIndicatorElement loading={loading}/>
      <ItemsListViewConfirmedOrders AllItems={AllItems} AllOrders={AllOrders}
      loading={loading}
      setloading={setloading}
      />
      </>

   );
}

export default ConfirmedOrders;