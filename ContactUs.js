import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Linking } from 'react-native';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { scale, verticalScale } from './Dimensions';
import { normalize } from './FontResize';

const ContactUs = ({ navigation }) => {

    const [loading, setloading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            title: "",
            headerStyle: {
                backgroundColor: '#77C98D',
                backgroundColor: '#DADADD',
            }
        });
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#424269'
        }}>
            <ScrollView contentContainerStyle={{
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}
            >
                 <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginHorizontal: scale(10),
                    marginTop: verticalScale(5),
                }}>
                    <Ionicons name="ios-arrow-back" size={normalize(22)} color="#fff" onPress={() => {
                        navigation.goBack()
                    }} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: verticalScale(5),
                    marginBottom: verticalScale(10),
                }}>
                    <Text style={{
                        fontSize: normalize(18),
                        fontWeight: '500',
                        color: '#fff',
                        letterSpacing: scale(0.8),
                        paddingVertical: verticalScale(1),
                        paddingHorizontal: scale(15),
                        borderBottomWidth: scale(0.7),
                        borderBottomColor: "#fff"
                    }}>
                        CONTACT US
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: verticalScale(10),
                }}>
                    <Image
                        style={{
                            width: Dimensions.get('window').width / 2,
                            height: Dimensions.get('window').width / 2,
                            borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                            borderWidth: scale(0.5),
                            borderColor: '#fff',
                            resizeMode: 'contain'
                        }}
                        source={{
                            uri: "https://firebasestorage.googleapis.com/v0/b/getit-d33e8.appspot.com/o/assets%2FlogoMain.png?alt=media&token=68be1839-74da-4518-bb69-9819888bf1a8"
                        }}
                        onLoadStart={() => setloading(true)}
                        onLoadEnd={() => {
                            setloading(false)
                        }}
                    />
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginHorizontal: scale(15),
                    marginTop: verticalScale(20)
                }}>
                    <Text style={{
                        fontSize: normalize(16),
                        fontWeight: '400',
                        letterSpacing: scale(0.6),
                        color: '#fff'

                    }}
                        onPress={async () => {
                            const url = 'mailto:rakshitkulkarni2002@gmail.com'
                            await Linking.openURL(url)
                        }}
                    >
                        Email: <Text style={{
                            color: 'blue',
                            fontWeight: '300',
                            color: '#07CACA',
                        }}>
                            rakshitkulkarni2002@gmail.com
                        </Text>
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginHorizontal: scale(15),
                    marginVertical: verticalScale(10)
                }}>
                    <Text style={{
                        fontSize: normalize(16),
                        fontWeight: '400',
                        letterSpacing: scale(0.6),
                        color: '#fff'
                        
                    }}
                        onPress={async () => {
                            const url = `tel://+91 9480527929`
                            await Linking.openURL(url)
                        }}
                    >
                        Mobile: <Text style={{
                            color: '#07CACA',
                            fontWeight: '300',
                            // letterSpacing: scale(0.)
                        }}>
                            +91 9480527929
                        </Text>
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginHorizontal: scale(15),
                    // marginTop: verticalScale(10)
                }}>
                    <Text style={{
                        fontSize: normalize(15),
                        fontStyle: 'italic',
                        fontWeight: '400',
                        letterSpacing: scale(0.5),
                        color: '#fff'
                    }}
                    >
                        SBI bank colony, Kumbarwada, Bidar: 585403, Karnataka, India.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ContactUs;
