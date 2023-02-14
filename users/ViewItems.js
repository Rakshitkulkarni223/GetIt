import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";
import ItemsListViewUsers from '../ListView/ItemListViewUsers';
import ActivityIndicatorElement from '../ActivityIndicatorElement';


const ViewItems = ({ navigation, OrderId, displayCurrentAddress, longitude, latitude }) => {

   const [AllItems, setAllItems] = useState([]);

   const [itemsList, setitemsList] = useState(ref(database, 'admin/items/'));

   const [totalamount, settotalamount] = useState(0);

   const [loading, setloading] = useState(false);

   var adminRatings = '';

   var ratings = '';

   useEffect(() => {
      const getRating = onValue(ref(database, `userRatings/${auth.currentUser.phoneNumber}/`),
         (snapshot) => {
            if (snapshot.exists()) {
               ratings = snapshot.val();
            }
         })
      return () => {
         getRating();
      }

   }, [])

   useEffect(() => {
      const getRating = onValue(ref(database, `adminItemRatings/`),
         (snapshot) => {
            if (snapshot.exists()) {
               adminRatings = snapshot.val();
            }
         })
      return () => {
         getRating();
      }
   }, [])

   useEffect(() => {

      setloading(true)

      const getitems = onValue(itemsList, (snapshot) => {

         var items = [];
         var count = 0;
         snapshot.forEach((child) => {
            count = true;
            child.forEach((it) => {
               var ItemRating = 0;
               var ItemTotalRating = 0

               var totalUsers = 0;

               var RatedBefore = false;

               if (ratings && ratings.hasOwnProperty(it.key)) {
                  ItemRating = ratings[it.key]["rating"]
                  RatedBefore = true;
               }

               if (adminRatings && adminRatings.hasOwnProperty(it.key)) {
                  ItemTotalRating = adminRatings[it.key]["Rating"]
                  totalUsers = adminRatings[it.key]["TotalUsers"]
               }

               items.push({
                  displaycategory: count,
                  key: it.key,
                  ItemName: it.val().ItemName,
                  ItemDesc: it.val().ItemDesc,
                  ItemCategory: it.val().ItemCategory,
                  ItemPrice: it.val().ItemPrice,
                  ItemImage: it.val().ItemImage,
                  ItemQuantity: 0,
                  TotalRating: ItemTotalRating,
                  totalUsers: totalUsers,
                  avgRating: totalUsers === 0 ? 0 : Math.round(ItemTotalRating / totalUsers * 100) / 100,
                  RatedBefore: RatedBefore,
                  UserRating: ItemRating,
                  ratingOne: ItemRating === 0 ? 'star-o' : ItemRating >= 1 ? 'star' : 'star-o',
                  ratingTwo: ItemRating === 0 ? 'star-o' : ItemRating >= 2 ? 'star' : 'star-o',
                  ratingThree: ItemRating === 0 ? 'star-o' : ItemRating >= 3 ? 'star' : 'star-o',
                  ratingFour: ItemRating === 0 ? 'star-o' : ItemRating >= 4 ? 'star' : 'star-o',
                  ratingFive: ItemRating === 0 ? 'star-o' : ItemRating == 5 ? 'star' : 'star-o',
               })
               count = false;
            })
         })
         setloading(false)
         setAllItems(items);

      });

      return () => {
         getitems();
      }

   }, [])

   return (
      <>
         <ActivityIndicatorElement loading={loading} />
         <ItemsListViewUsers navigation={navigation} OrderId={OrderId} DATA={AllItems}
            qtyhandler={true} showfooter={true}
            totalamount={totalamount} settotalamount={settotalamount}
            loading={loading}
            setloading={setloading}
            displayCurrentAddress={displayCurrentAddress}
            longitude={longitude}
            latitude={latitude}
         ></ItemsListViewUsers>
      </>

   );
}

export default ViewItems;