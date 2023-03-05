import React, { useEffect, useState } from 'react'
import { Dimensions, Image } from 'react-native';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { scale, verticalScale } from './Dimensions';
import { normalize } from './FontResize';

const AboutUs = ({ navigation }) => {

    const [loading, setloading] = useState(false);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
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
                    justifyContent: 'center',
                    marginVertical: verticalScale(20)
                }}>
                    <Text style={{
                        fontSize: normalize(20),
                        fontWeight: '500',
                        letterSpacing: scale(0.5),
                        paddingVertical: verticalScale(1),
                        paddingHorizontal: scale(15),
                        borderBottomWidth: scale(0.7),
                        borderBottomColor: "#fff",
                        color: '#fff'
                    }}>
                        ABOUT US
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
                    justifyContent: 'center',
                    marginVertical: verticalScale(20)
                }}>
                    <Text style={{
                        fontSize: normalize(20),
                        fontWeight: '500',
                        letterSpacing: scale(0.8),
                        color: '#fff'
                    }}>
                        Welcome To GetIt
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginHorizontal: scale(14)
                }}>
                    <Text style={{
                        fontSize: normalize(16),
                        fontWeight: '300',
                        letterSpacing: scale(0.5),
                        color: '#fff'
                    }}>
                        If you're looking 👁️ for a convenient way to get your favorite food 😋 delivered right to your door 🏠,
                        then you should definitely try <Text style={{
                            fontWeight: '600',
                            letterSpacing: scale(0.5)
                        }}>
                        GetIt 🤩✨{"\n\n"}
                        </Text>
                        No more waiting⌛in line at the restaurant or fighting traffic!
                        With just a few clicks of a button, you can have hot ♨️ and delicious meals delivered directly to your location📍
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default AboutUs;
