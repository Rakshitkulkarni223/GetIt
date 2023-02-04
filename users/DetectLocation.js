import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, TextInput, View, Pressable, Button, StyleSheet, SafeAreaView, Modal, PermissionsAndroid, Alert } from 'react-native';

import * as Location from 'expo-location';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from '../Dimensions';

const ModalInput = ({ setvalues, onSubmit, visible, values, toggle }) => {
    return (
        <Modal visible={visible} transparent={true} style={{
            justifyContent: 'center'
        }}>
            <View
                style={{
                    // height: verticalScale(215),
                    paddingTop: scale(10),
                    paddingBottom: scale(15),
                    paddingRight: scale(15),
                    paddingLeft: scale(15),
                    bottom: verticalScale(0),
                    position: 'absolute',
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    borderRadius: scale(3),
                    borderColor: 'black',
                    borderWidth: scale(1),
                }}>
                <View>
                    <Text style={{
                        fontSize: moderateScale(18),
                        fontWeight: 'bold'
                    }}>Add Location Information</Text>
                </View>
                <View
                    style={{ marginTop: scale(10) }}
                >
                    <TextInput
                        value={values.housename}
                        onChangeText={(housename) =>
                            setvalues.sethousename(housename)
                        }
                        placeholder={'Enter  compartment/house name..'}
                        autoFocus
                        style={styles.locationInfo}
                    />
                </View>
                <View style={{ marginTop: scale(10) }}>
                    <TextInput
                        value={values.streetname}
                        onChangeText={(streetname) =>
                            setvalues.setstreetname(streetname)
                        }
                        placeholder={'Enter street name...'}
                        style={styles.locationInfo}
                    />
                </View>

                <View style={{ marginTop: scale(10) }}>
                    <TextInput
                        value={values.cityname}
                        onChangeText={(cityname) =>
                            setvalues.setcityname(cityname)
                        }
                        placeholder={'Enter city and state name...'}
                        style={styles.locationInfo}
                    />
                </View>

                <View style={{ marginTop: scale(10) }}>
                    <TextInput
                        value={values.postalcode}
                        onChangeText={(postalcode) =>
                            setvalues.setpostalcode(postalcode)
                        }
                        autoCompleteType="tel"
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        placeholder={'Enter postal code...'}
                        style={styles.locationInfo}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: scale(30), marginBottom: scale(5) }}>
                    <View style={{
                        marginRight: scale(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: verticalScale(7),
                        paddingHorizontal: scale(30),
                        borderRadius: scale(4),
                        elevation: scale(18),
                        backgroundColor: 'black',
                    }}>
                        <Pressable onPress={toggle}>
                            <Text style={{
                                fontSize: moderateScale(15),
                                lineHeight: scale(18),
                                fontWeight: 'bold',
                                letterSpacing: scale(1),
                                color: 'white',
                            }}>CANCEL</Text>
                        </Pressable>
                        {/* <Button title="set location" onPress={onSubmit} /> */}
                    </View>
                    <View style={{
                        marginLeft: scale(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: verticalScale(7),
                        paddingHorizontal: scale(20),
                        borderRadius: scale(4),
                        elevation: scale(18),
                        backgroundColor: 'black',
                    }}>
                        <Pressable onPress={onSubmit}>
                            <Text style={{
                                fontSize: moderateScale(15),
                                lineHeight: scale(18),
                                fontWeight: 'bold',
                                letterSpacing: scale(1),
                                color: 'white',
                            }}>SET LOCATION</Text>
                        </Pressable>
                        {/* <Button title="set location" onPress={onSubmit} /> */}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const DetectLocation = ({ navigation, displayCurrentAddress, setDisplayCurrentAddress, longitude, setlongitude, latitude, setlatitude }) => {

    const [visible, setVisible] = useState(false);
    const [housename, sethousename] = useState('');
    const [streetname, setstreetname] = useState('');
    const [postalcode, setpostalcode] = useState('');
    const [cityname, setcityname] = useState('');

    const [isautomatic, setisautomatic] = useState(true);

    useEffect(() => {
        GetCurrentLocation();
    }, [])



    const GetCurrentLocation = async () => {

        setisautomatic(true);

        setlatitude("");
        setlongitude("");
        setDisplayCurrentAddress('');

        try {

            // let { status } = await Location.requestForegroundPermissionsAsync();

            // console.log(status)

            // if (status !== 'granted') {
            //     setErrorMsg('Permission to access location was denied');
            //     return;
            // }

            let { coords } = await Location.getCurrentPositionAsync();

            // console.log(coords)

            if (coords) {
                const { latitude, longitude } = coords;
                setlatitude(latitude);
                setlongitude(longitude);
                let response = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });

                let address = '';
                for (let item of response) {
                    if (item.name) {
                        address += item.name;
                    }
                    if (item.street) {
                        address += ', ' + item.street
                    }
                    if (item.city) {
                        address += ', ' + item.city
                    }
                    if (item.postalCode) {
                        address += ', ' + item.postalCode
                    }
                }
                // let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
                setDisplayCurrentAddress(address);
            }
        }
        catch (e) {
            alert(
                'Location Permission not granted.Please enable location Permission'
            );
        }
    };

    const getLocationFromAddress = async () => {

        setisautomatic(false)

        setlatitude("");
        setlongitude("");
        setDisplayCurrentAddress('');
        // let {location} =  await Location.geocodeAsync(`${housename} ${streetname} ${cityname} ${postalcode}`)

        let { coords } = await Location.geocodeAsync('1 Hacker Way');
        //    console.log(coords)
        // console.log(cityname, postalcode,housename,streetname)

        if (`${housename}` === '') {
            Alert.alert('Location Not Found', 'Please enter compartment/house name', [
                {
                    text: 'Ok',
                },
            ])
            setDisplayCurrentAddress('');
            return;
        }
        if (`${streetname}` === '') {
            Alert.alert('Location Not Found', 'Please enter street name', [
                {
                    text: 'Ok',
                },
            ])
            setDisplayCurrentAddress('');
            return;
        }
        if (`${cityname}` === '') {
            Alert.alert('Location Not Found', 'Please enter city and state name', [
                {
                    text: 'Ok',
                },
            ])
            setDisplayCurrentAddress('');
            return;
        }
        if (`${postalcode}` === '') {
            Alert.alert('Location Not Found', 'Please enter postal code', [
                {
                    text: 'Ok',
                },
            ])
            setDisplayCurrentAddress('');
            return;
        }
        setDisplayCurrentAddress(`${housename}, ${streetname}, ${cityname}, ${postalcode}`)
        if (coords) {
            const { latitude, longitude } = coords;
            setlatitude(latitude);
            setlongitude(longitude);
        }
        setVisible(!visible)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

            <View style={{ margin: scale(10),}}>
            {isautomatic ?
                <Text style={{
                   
                    fontSize: moderateScale(16),
                    lineHeight: scale(18),
                    // fontWeight: 'bold',
                    letterSpacing: scale(0.5),
                }}>Current Address</Text>
                : <Text style={{
                    // margin: scale(10),
                    fontSize: moderateScale(16),
                    lineHeight: scale(18),
                    // fontWeight: 'bold',
                    letterSpacing: scale(0.5),
                }}>Manually Entered Address</Text>
            }
            </View>

            <Text style={{
                margin: scale(10),
                fontSize: moderateScale(16),
                lineHeight: scale(18),
                fontWeight: 'bold',
                letterSpacing: scale(0.5),

            }}>{displayCurrentAddress}</Text>

            <ModalInput
                visible={visible}
                values={{
                    housename: housename,
                    cityname: cityname,
                    streetname: streetname,
                    postalcode: postalcode
                }}

                setvalues={{
                    sethousename: sethousename,
                    setcityname: setcityname,
                    setstreetname: setstreetname,
                    setpostalcode: setpostalcode
                }}
                toggle={() => setVisible(!visible)}
                onSubmit={getLocationFromAddress}
            />
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                margin: scale(25),
            }}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: verticalScale(5),
                        paddingHorizontal: scale(2),
                        borderRadius: scale(4),
                        elevation: scale(18),
                        marginBottom: scale(25),
                        backgroundColor: 'black',
                    }}>
                        <View>
                            <MaterialCommunityIcons name="target" size={scale(20)} color="red" onPress={() => GetCurrentLocation()} />
                        </View>
                        <View style={{ paddingLeft: scale(10), }}>
                            <Pressable onPress={() => GetCurrentLocation()}>
                                <Text style={styles.text}>Detect Location</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: scale(25),
                }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>OR</Text>
                </View>

                <View>
                    <Pressable style={styles.button} onPress={() => setVisible(!visible)}>
                        <Text style={styles.text}>Enter Location Manually</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default DetectLocation;


const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(30),
        borderRadius: scale(4),
        elevation: scale(18),
        backgroundColor: 'black',
    },
    text: {
        fontSize: moderateScale(16),
        lineHeight: scale(18),
        fontWeight: 'bold',
        letterSpacing: scale(0.5),
        color: 'white',
    },
    locationInfo: {
        color: "black",
        paddingLeft: scale(10),
        paddingRight: scale(10),
        borderWidth: scale(1),
        borderRadius: scale(5),
        borderColor: "black",
    },
})