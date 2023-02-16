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
    StatusBar,
    Keyboard,
    Animated,
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

    const [lineLength] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(lineLength, {
            toValue: 350,
            duration: 1000,
            useNativeDriver: true, // Use the native driver for better performance
        }).start();
    }, []);

    const lineStyle = {
        height: 3,
        backgroundColor: color,
        transform: [{ scaleX: lineLength }],
    };

    // console.log(StatusBar.currentHeight)

    return (

        <Modal visible={loading} transparent={true}>
            <View style={{
                position:'absolute', left:0, right:0, bottom:0, top: normalize(StatusBar.currentHeight+1)
                // position: 'absolute',
                // flex: 0.8,
                // flexDirection: 'column',
                // justifyContent: 'flex-end',
            }}>
                {/* <ActivityIndicator  size="large" color={color} animating={true} /> */}
                <Animated.View style={lineStyle} />
            </View>
        </Modal>

    );
};

export default ActivityIndicatorElement;