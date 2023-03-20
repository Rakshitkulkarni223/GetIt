import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    NativeModules,
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
    Dimensions,
} from "react-native";

import { scale } from './Dimensions';

import { normalize } from './FontResize';




const ActivityIndicatorElement = ({ loading, round }) => {

    const [color, setColor] = useState('#525A87');

    const colorArray = ["#525A87"];

    useEffect(() => {
        const id = setInterval(() => {
            var index = Math.floor(Math.random() * colorArray.length);
            // console.log(index)
            setColor((colorArray[0]))
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
        height: 4,
        backgroundColor: color,
        transform: [{ scaleX: lineLength }],
    };

    return (

        <Modal visible={loading} transparent={true}>
            <SafeAreaView style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent:  'center'
            }}>
                <ActivityIndicator  size="large" color={color} animating={true} /> 
                {/* { round  ? 
                :
                <View style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, top: 56
                }}>
                    <Animated.View style={lineStyle} />
                </View>} */}
            </SafeAreaView>
        </Modal>

    );
};

export default ActivityIndicatorElement;