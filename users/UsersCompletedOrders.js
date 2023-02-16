import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ItemsListViewUsers from '../ListView/ItemListViewUsers';
import ItemListViewCompletedOrdersUsers from '../ListView/ItemListViewCompletedOrdersUsers';
import ActivityIndicatorElement from '../ActivityIndicatorElement';


const UsersCompletedOrders = ({navigation}) => {

   const [AllOrders, setAllOrders] = useState([]);

   const [itemsList,setitemsList] = useState(ref(database, `users/${auth.currentUser.phoneNumber}/orders`));

   const [loading, setloading] = useState(false);
   
   
   useEffect(() => {

      setloading(true)

      const getitems = onValue(itemsList, (snapshot) => {

         var items = [];
         var orders = [];

         var data = [];

         
         var AuthId = "";
         
         var flag = true;
         var showuser = true;
         snapshot.forEach((child)=>{

            showuser = true;
            var totalamount = 0;
            items = [];
            var Location= '';
            var Longitude = ''
            var Latitude = ''
            var date = '';
            var OrderStatus = -1;
            var OrderId = '';
            var phoneNumber = '';
            
            
            child.forEach((it)=>{

            
               if(it.key=== "orderStatus")
               {
                  it.forEach((status)=>{
                     OrderStatus = status.val()
                  })
               }

               if(it.key=== "orderDetails")
               {
                  it.forEach((orderDetails)=>{
                     if(orderDetails.key === 'Location')
                     {
                        Location =  orderDetails.val()
                     }
                     if(orderDetails.key === 'Longitude')
                     {
                        Longitude =  orderDetails.val()
                     }
                     if(orderDetails.key === 'Latitude')
                     {
                        Latitude =  orderDetails.val()
                     }
                     if(orderDetails.key === 'phoneNumber')
                     {
                        phoneNumber =  auth.currentUser.phoneNumber
                     }
                     if(orderDetails.key === 'OrderId')
                     {
                        OrderId =  orderDetails.val()
                     }
                  })
               }

               it.forEach((item)=>{
                  flag = true;

                  item.forEach((eachitem)=>{
                     
                     totalamount += eachitem.val().ItemPrice*eachitem.val().ItemQuantity;

                     date = eachitem.val().ItemAddedDate;

                     items.push({
                        key:eachitem.key,
                        ItemCategory: item.key,
                        displayCategory: flag,
                        displayUser: showuser,
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
                     // AuthId = eachitem.val().AuthId;
                  })
               })
            })
            data = items;
            orders.push({key: child.key,value: data, toggle: false,  
               totalamount: totalamount, Location: Location ,Longitude: Longitude,Latitude: Latitude,
               Date : date, OrderStatus : OrderStatus, phoneNumber: phoneNumber, OrderId: OrderId
            });
         })

         orders.sort(function(item1, item2) {
            var val1 = new Date(item1['Date']);
            var val2 = new Date(item2['Date']);
            if (val1 < val2) return 1;
            if (val1 > val2) return -1;
            return 0;
          });

         setAllOrders(orders);

         setloading(false)
      });

      return () =>{
         getitems();
      }

   }, [])

   return (
      <>
      <ActivityIndicatorElement loading={loading}/>
      <ItemListViewCompletedOrdersUsers AllOrders={AllOrders} loading={loading} setloading={setloading}/>
      </>
   );
}

export default UsersCompletedOrders;