import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import ItemsListViewAdmin from '../ListView/ItemsListViewAdmin';
import { app, auth, db, database } from "../Firebase";
import { ref, onValue, get, child } from "firebase/database";

const ViewItems = () => {

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
      <ItemsListViewAdmin DATA={AllItems}></ItemsListViewAdmin>
   );
}

export default ViewItems;




















// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, SectionList, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
// import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import UpdateItem from '../admin/UpdateItem';
// import { app, auth, db, database } from "../Firebase";
// import { ref, set } from "firebase/database";
// import { onValue } from "firebase/database";


// const Item = ({ setupdate, setItemCategory, setItemName, setItemImage, setItemDesc, setItemPrice, id, title, image_url, price, description, category }) => (

//    <View style={styles.container}>
//       <Image source={{ uri: image_url }} style={styles.photo} />
//       <View style={styles.container_text}>
//          <Text style={styles.title}>
//             {title}
//          </Text>
//          <Text style={styles.description}>
//             {description}
//          </Text>
//       </View>
//       <View style={styles.container_price}>
//          <Text style={styles.title}>
//             {price}/-
//          </Text>
//       </View>
//       <View style={styles.container_update}>
//          <AntDesign name="edit" size={24} color="black" onPress={(e) => {
//             setItemName(title);
//             setItemDesc(description);
//             setItemImage(image_url);
//             setItemPrice(price);
//             setupdate(true);
//          }} />
//       </View>
//       <View style={styles.container_update}>
//          <MaterialCommunityIcons name="delete" size={24} color="red" onPress={async () => {
//             console.log(id.split(" ")[1])
//             console.log(category)
//             set(ref(database, `admin/items/${category}/` + id.split(" ")[1]), {
//                // ItemName: "",
//                // ItemPrice: "",
//                // ItemDesc: "",
//                // ItemImage: ""
//             });
//          }} />
//       </View>
//    </View>
// );

// const ViewItems = () => {

//    const [update, setupdate] = useState(false);
//    const [deleteitem, setdeleteitem] = useState(false);

//    const [ItemName, setItemName] = useState("");
//    const [ItemDesc, setItemDesc] = useState("");
//    const [ItemCategory, setItemCategory] = useState("");
//    const [ItemPrice, setItemPrice] = useState("");
//    const [ItemImage, setItemImage] = useState("");
//    const [AllItems, setAllItems] = useState([]);

//    useEffect(() => {
//       // const dbRef = ref(database);

//       const starCountRef = ref(database, 'admin/items/');

//       onValue(starCountRef, (snapshot) => {
//          const data = snapshot.val();
//          for (let item_category in data) {
//             for (let item_id in data[item_category]) {
//                console.log(!AllItems.find(e => e.id === item_id))
//                if (!AllItems.find(e => e.id === item_id)) {
//                   var itemList = {}
//                   itemList["id"] = item_category + " " + item_id
//                   for (let items in data[item_category][item_id]) {
//                      itemList[items] = data[item_category][item_id][items];
//                   }
//                   setAllItems(current => [...current, itemList]);
//                   console.log(itemList)
//                }
//             }

//          }
//       });

//    }, [])

//    const renderItem = ({ item }) => (
//       <Item
//          id={item.id}
//          setupdate={setupdate}
//          title={item.ItemName}
//          image_url={item.ItemImage}
//          description={item.ItemDesc}
//          price={item.ItemPrice}
//          category={item.ItemCategory}
//          setItemName={setItemName}
//          setItemDesc={setItemDesc}
//          setItemImage={setItemImage}
//          setItemPrice={setItemPrice}
//          setdeleteitem={setdeleteitem}
//          setItemCategory={setItemCategory}
//       />
//    );

//    return (
//       <>
//          {update ?
//             <UpdateItem title={ItemName} description={ItemDesc} image_url={ItemImage} price={ItemPrice} category={ItemCategory} />
//             :
//             <SafeAreaView style={styles.container}>
//                {/* <FlatList
//                   data={AllItems}
//                   renderItem={renderItem}
//                   keyExtractor={item => item.id}
//                /> */}
//             </SafeAreaView>
//          }
//       </>
//    )
// }


// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
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

// export default ViewItems;
