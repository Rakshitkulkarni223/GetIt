import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ItemsListViewPendingOrders from '../ListView/ItemListViewPendingOrders';


const PendingOrders = () => {

   const [AllItems, setAllItems] = useState([]);

   const [AllOrders, setAllOrders] = useState([]);

   const [toggle, settoggle]= useState(false);


   const [itemsList,setitemsList] = useState(ref(database, 'users/confirmedOrders/'));


   useEffect(() => {

      const getitems = onValue(itemsList, (snapshot) => {
         var items = [];
         var orders = [];
         var data = [];

         var flag = true;
         var showuser = true;
         snapshot.forEach((child)=>{
            items = [];
            showuser = true;
            var Location = '';
            var totalamount = 0;
            var Longitude = ''
            var Latitude = ''

            var date = ''

            child.forEach((it)=>{
               it.forEach((item)=>{
                  flag = true;
                  item.forEach((eachitem)=>{
                     totalamount += eachitem.val().ItemPrice*eachitem.val().ItemQuantity;
                     Location = eachitem.val().Location;
                     Longitude =eachitem.val().Longitude;
                     Latitude = eachitem.val().Latitude;
                     date = eachitem.val().ItemAddedDate;

                     items.push({
                        key:eachitem.key,
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
                        ItemAddedDate: eachitem.val().ItemAddedDate,
                     })
                     showuser = false;
                     flag = false;
                  })
                  
               })
            })
            data = items;
            orders.push({key: child.key,value: data, toggle: false,
                totalamount: totalamount, Location: Location ,
                Longitude: Longitude,Latitude: Latitude,
                Date : date
               });
         })

         orders.sort(function(item1, item2) {
            var val1 = new Date(item1['Date']);
            var val2 = new Date(item2['Date']);
            if (val1 < val2) return 1;
            if (val1 > val2) return -1;
            return 0;
          });

         // items.push({ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" })
         setAllItems(items);
         setAllOrders(orders);
      });

      return () =>{
         getitems();
      }

   }, [])

   return (
      // <></>
      <ItemsListViewPendingOrders AllItems={AllItems} AllOrders={AllOrders}
      ></ItemsListViewPendingOrders>
   );
}

export default PendingOrders;


// import React, { Component, useState, useEffect, Children } from 'react';
// import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, ScrollView } from 'react-native';
// import Accordion from 'react-native-collapsible/Accordion';

// import { app, auth, db, database } from "../Firebase";
// import { ref, onValue } from "firebase/database";
// import ItemsListViewPendingOrders from '../ListView/ItemListViewPendingOrders';

// import { AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

// const Item = ({ id, title, image_url, price, description, category, displayCategory, quantity, displayUser }) => (
//    <>
//       {/* {displayUser ? <Text style={{
//        fontSize: 15,
//        fontWeight: "bold",
//        // fontStyle: 'italic'
//    }}>{displayUser}</Text> : <></>*/}
//       {displayCategory ? <Text style={{
//          fontSize: 15,
//          fontWeight: "bold",
//          // fontStyle: 'italic'
//       }}>{category}</Text> : <></>}

//       <View style={styles.container}>
//          <Image source={{ uri: image_url }} style={styles.photo} />
//          <View style={styles.container_text}>
//             <Text style={styles.title}>
//                {title}
//             </Text>
//             <Text style={styles.description}>
//                {description}
//             </Text>
//          </View>
//          <View style={styles.container_price}>
//             <Text style={styles.title}>
//                {price}/-
//             </Text>
//          </View>
//          <View style={styles.container_price}>
//             <Text style={styles.title}>
//                {quantity}
//             </Text>
//          </View>
//          <View style={styles.container_update}>
//             <AntDesign name="checkcircleo" size={24} color="green" />
//          </View>
//          <View style={styles.container_update}>
//             <Entypo name="cross" size={24} color="red" />
//          </View>
//       </View>
//    </>
// );

// const PendingOrders = () => {
//    const [activeSections, setactiveSections] = useState([]);

//    const [AllItems, setAllItems] = useState([]);

//    const [itemsList, setitemsList] = useState(ref(database, 'users/confirmedOrders/'));


//    useEffect(() => {

//       const getitems = onValue(itemsList, (snapshot) => {

//          var flag = true;

//          var items = []
//          snapshot.forEach((child) => {

//             var eachitemContent = [];

//             child.forEach((it) => {
//                it.forEach((item) => {
//                   flag = true;
//                   item.forEach((eachitem) => {
//                      eachitemContent.push({
//                         key: eachitem.key,
//                         ItemCategory: item.key,
//                         displayCategory: flag,
//                         ItemName: eachitem.val().ItemName,
//                         ItemDesc: eachitem.val().ItemDesc,
//                         ItemCategory: eachitem.val().ItemCategory,
//                         ItemPrice: eachitem.val().ItemPrice,
//                         ItemImage: eachitem.val().ItemImage,
//                         ItemQuantity: eachitem.val().ItemQuantity,
//                         ItemAddedDate: eachitem.val().ItemAddedDate,
//                      })
//                      flag = false;
//                   })
//                })
//             })

//             items.push({ title: child.key, content: eachitemContent })

//             // console.log(items)
//          })

//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          items.push({ title: "udfhdfhjdf", content: [{ "ItemAddedDate": "Sat Jan 14 21:48:32 2023", "ItemCategory": "Breakfast", "ItemDesc": "Masala dosa", "ItemImage": "Test", "ItemName": "Dosa", "ItemPrice": "50", "ItemQuantity": 1, "displayCategory": true, "key": "BreakfastDosaMasaladosa" }, { "ItemAddedDate": "Sat Jan 14 21:48:34 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Idly", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastIdly2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:35 2023", "ItemCategory": "Breakfast", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Vada", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": false, "key": "BreakfastVada2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:36 2023", "ItemCategory": "Cold Beverages", "ItemDesc": "50 ml", "ItemImage": "https://images.healthshots.com/healthshots/hi/uploads/2021/11/29201838/Idli-vs-vada-1-1600x900.jpg", "ItemName": "Frooti", "ItemPrice": "15", "ItemQuantity": 2, "displayCategory": true, "key": "ColdBeveragesFrooti50ml" }, { "ItemAddedDate": "Sat Jan 14 21:48:37 2023", "ItemCategory": "Ice cream", "ItemDesc": "Butter scotch", "ItemImage": "Test", "ItemName": "Ice cream", "ItemPrice": "30", "ItemQuantity": 1, "displayCategory": true, "key": "IcecreamIcecreamButterscotch" }, { "ItemAddedDate": "Sat Jan 14 21:48:38 2023", "ItemCategory": "Snacks", "ItemDesc": "2 pieces", "ItemImage": "Test", "ItemName": "Samosa", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "SnacksSamosa2pieces" }, { "ItemAddedDate": "Sat Jan 14 21:48:39 2023", "ItemCategory": "Test", "ItemDesc": "Test", "ItemImage": "Test", "ItemName": "Test", "ItemPrice": "30", "ItemQuantity": 2, "displayCategory": true, "key": "TestTestTest" }] })
//          setAllItems(items);
//       });

//       return () => {
//          getitems();
//       }

//    }, [])

//    const renderSectionTitle = (section) => {
//       // console.log(section)
//       return (
//          <View>
//             {/* <Text>{section.title}</Text> */}
//          </View>
//       );
//    };

//    const renderHeader = (section) => {
//       return (
//          <View >
//             <Text>{section.title}</Text>
//          </View>
//       );
//    };

//    const renderItem = ({ item }) => (
//       <Item
//           id={item.key}
//           displayCategory={item.displayCategory}
//           title={item.ItemName}
//           image_url={item.ItemImage}
//           description={item.ItemDesc}
//           price={item.ItemPrice}
//           category={item.ItemCategory}
//           quantity={item.ItemQuantity}
//       // displayUser={item.items.displayUser}
//       />
//   );

//    const renderContent = (section) => {
//       return (
//          // <SafeAreaView style={{flex: 1}}>
//             // <ScrollView>
//                <View>

//                <FlatList
//                         data={section.content}
//                         renderItem={renderItem}
//                         keyExtractor={(item, index) => String(index)}
//                     />

//                   {/* {section.content.map((val, key) => {
//                      <Item
                        
//                         id={val.key}
//                         displayCategory={val.displayCategory}
//                         title={val.ItemName}
//                         image_url={val.ItemImage}
//                         description={val.ItemDesc}
//                         price={val.ItemPrice}
//                         category={val.ItemCategory}
//                         quantity={val.ItemQuantity}
//                      // // displayUser={item.items.displayUser}
//                      />
//                   })} */}

//                </View>
//             // </ScrollView>
//          // </SafeAreaView>
//          // <ItemsListViewPendingOrders DATA={section.content}></ItemsListViewPendingOrders>

//       );
//    };

//    const updateSections = (activeSections) => {
//       setactiveSections(activeSections);
//    };

//    return (
//       <SafeAreaView>
//          <Accordion
//             sections={AllItems}
//             activeSections={activeSections}
//             renderSectionTitle={renderSectionTitle}
//             renderHeader={renderHeader}
//             renderContent={renderContent}
//             onChange={updateSections}
//          />
//       </SafeAreaView>
//    );
// }

// export default PendingOrders;



// const styles = StyleSheet.create({
//    container: {
//       // flex: 1,
//       flexDirection: 'row',
//       padding: 10,
//       marginLeft: 16,
//       marginRight: 16,
//       marginTop: 8,
//       marginBottom: 8,
//       borderRadius: 5,
//       backgroundColor: '#FFF',
//       elevation: 2,
//    },
//    title: {
//       fontSize: 16,
//       color: '#000',
//    },
//    container_text: {
//       flex: 1,
//       flexDirection: 'column',
//       marginLeft: 12,
//       justifyContent: 'center',
//    },
//    container_price: {
//       flex: 1,
//       flexDirection: 'column',
//       marginLeft: 12,
//       justifyContent: 'center',
//    },
//    container_update: {
//       flex: 1,
//       flexDirection: 'column',
//       marginLeft: 12,
//       justifyContent: 'center',
//    },
//    description: {
//       fontSize: 11,
//       fontStyle: 'italic',
//    },
//    photo: {
//       height: 50,
//       width: 50,
//    },
// });