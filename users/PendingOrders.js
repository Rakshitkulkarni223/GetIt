import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, View, Button } from 'react-native';

const PendingOrders = ({ navigation }) => {

   return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <TouchableOpacity style={{ margin: 128 }}>
            <Text>This is user's PendingOrders!</Text>
         </TouchableOpacity>
      </View>
   )
}
export default PendingOrders