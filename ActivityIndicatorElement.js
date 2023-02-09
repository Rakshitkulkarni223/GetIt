import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Button,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Modal,
} from "react-native";


import { scale } from './Dimensions';

import { normalize } from './FontResize';

const ActivityIndicatorElement = ({ loading }) => {

    const [color, setColor] = useState('teal');
    useEffect(() => {
      const id = setInterval(() => {
        setColor((color) => color == 'teal' ? 'royalblue' : 'teal');
      }, 500);
      return () => clearInterval(id);
    }, []);

    return (
        <Modal visible={loading} transparent={true}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <ActivityIndicator  size="large" color={color} animating={true} />
            </View>
        </Modal>
    );
};

export default ActivityIndicatorElement;