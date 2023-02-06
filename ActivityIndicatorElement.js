import React from 'react'
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
    return (
        <Modal visible={loading} transparent={true}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <ActivityIndicator size="large" color="#2F66EE" animating={true} />
            </View>
        </Modal>
    );
};

export default ActivityIndicatorElement;