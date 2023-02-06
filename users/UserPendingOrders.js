import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, View, Button } from 'react-native';
import ItemListViewUserPendingOrders from '../ListView/ItemListViewUserPendingOrders';

import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ActivityIndicatorElement from '../ActivityIndicatorElement';

const UserPendingOrders = ({ navigation }) => {

   const [AllOrders, setAllOrders] = useState([]);

   const [itemsList,setitemsList] = useState(ref(database, `users/userpendingOrders/${auth.currentUser.phoneNumber}/`));


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
                        AuthId: eachitem.val().AuthId,
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
      <ItemListViewUserPendingOrders AllOrders={AllOrders} loading={loading} setloading={setloading}/>
      </>
   );
}
export default UserPendingOrders;