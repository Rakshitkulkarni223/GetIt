import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ItemsListViewUsers from '../ListView/ItemListViewUsers';


const ViewItems = ({navigation, OrderId}) => {

   const [AllItems, setAllItems] = useState([]);

   const [itemsList,setitemsList] = useState(ref(database, 'admin/items/'));
   
   
   useEffect(() => {

      const getitems = onValue(itemsList, (snapshot) => {
         var items = [];
         var count = 0;
         snapshot.forEach((child)=>{
            count = true; 
            child.forEach((it)=>{     
               items.push({
                  displaycategory: count,
                  key:it.key,
                  ItemName: it.val().ItemName,
                  ItemDesc: it.val().ItemDesc,
                  ItemCategory: it.val().ItemCategory,
                  ItemPrice: it.val().ItemPrice,
                  ItemImage:it.val().ItemImage,
                  ItemQuantity: 0
               })
               count=false;
            })
         })
         setAllItems(items);
      });

      return () =>{
         getitems();
      }

   }, [])

   return (
      <ItemsListViewUsers navigation={navigation} OrderId={OrderId} DATA={AllItems} qtyhandler={true} showfooter={true}></ItemsListViewUsers>
   );
}

export default ViewItems;