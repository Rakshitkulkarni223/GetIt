import React, { useEffect, useState, setState } from 'react'
import { TouchableOpacity, Text, TextInput, View, Button, StyleSheet, SafeAreaView, Modal, PermissionsAndroid, Alert } from 'react-native';

import * as Location from 'expo-location';

const ModalInput = ({ setvalues, onSubmit, visible, values, toggle }) => {
    return (
        <Modal visible={visible} transparent={true} style={{ justifyContent: 'center' }}>
            <View
                style={{
                    height: 270,
                    padding: 20,
                    bottom: 0,
                    position: 'absolute',
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    borderColor: 'black',
                    borderWidth: 2,
                }}>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        value={values.housename}
                        onChangeText={(housename) =>
                            setvalues.sethousename(housename)
                        }
                        placeholder={'Enter  compartment/house name..'}
                        style={{
                            color: "black",
                            paddingLeft: 15,
                            paddingRight: 15,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: "red",
                        }}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        value={values.streetname}
                        onChangeText={(streetname) =>
                            setvalues.setstreetname(streetname)
                        }
                        placeholder={'Enter street name...'}
                        style={{
                            color: "black",
                            paddingLeft: 15,
                            paddingRight: 15,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: "red",
                        }}
                    />
                </View>

                <View style={{ marginTop: 10 }}>
                    <TextInput
                        value={values.cityname}
                        onChangeText={(cityname) =>
                            setvalues.setcityname(cityname)
                        }
                        placeholder={'Enter city and state name...'}
                        style={{
                            color: "black",
                            paddingLeft: 15,
                            paddingRight: 15,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: "red",
                        }}
                    />
                </View>

                <View style={{ marginTop: 10 }}>
                    <TextInput
                        value={values.postalcode}
                        onChangeText={(postalcode) =>
                            setvalues.setpostalcode(postalcode)
                        }
                        placeholder={'Enter postal code...'}
                        style={{
                            color: "black",
                            paddingLeft: 15,
                            paddingRight: 15,
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: "red",
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 40 }}>
                    <View style={{ marginRight: 20 }}>
                        <Button title="Cancel" onPress={toggle} />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Button title="set location" onPress={onSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const DetectLocation = ({ displayCurrentAddress, setDisplayCurrentAddress }) => {

    const [longitude, setlongitude] = useState('');
    const [latitude, setlatitude] = useState('');

    const [visible, setVisible] = useState(false);
    const [housename, sethousename] = useState('');
    const [streetname, setstreetname] = useState('');
    const [postalcode, setpostalcode] = useState('');
    const [cityname, setcityname] = useState('');

    useEffect(() => {
        GetCurrentLocation();
    }, [])



    const GetCurrentLocation = async () => {

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

                for (let item of response) {
                    let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
                    setDisplayCurrentAddress(address);
                }
            }
        }
        catch (e) {
            alert(
                'Location Permission not granted.Please enable location Permission'
            );
        }
    };

    const getLocationFromAddress = async () => {

        setlatitude("");
        setlongitude("");
        setDisplayCurrentAddress('');
        // let {location} =  await Location.geocodeAsync(`${housename} ${streetname} ${cityname} ${postalcode}`)

        let { coords } = await Location.geocodeAsync('1 Hacker Way');
        //    console.log(coords)
        // console.log(cityname, postalcode,housename,streetname)
        setDisplayCurrentAddress(`${housename}${streetname}${cityname}${postalcode}`)
        if (coords) {
            const { latitude, longitude } = coords;
            //   console.log(latitude, longitude)
            setlatitude(latitude);
            setlongitude(longitude);
        }
        setVisible(!visible)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

            <Text style={{ margin: 10 }}>{displayCurrentAddress}</Text>
            <Text style={{ margin: 10 }}>{latitude}</Text>
            <Text style={{ margin: 10 }}>{longitude}</Text>

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

            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    alignItems: "flex-start",
                }}>
                    <View>
                        <TouchableOpacity onPress={() => GetCurrentLocation()}
                        // style={styles.fab}
                        >
                            <Text
                            // style={styles.fabIcon}
                            >Detect Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    alignItems: "flex-end",
                }}>
                    <View>
                        <TouchableOpacity onPress={() => setVisible(!visible)}
                        // style={styles.fab}
                        >
                            <Text
                            // style={styles.fabIcon}
                            >Enter Location Manually</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}


export default DetectLocation;


const styles = StyleSheet.create({
    container: {
        top: 400,
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
    },
    mainBody: {
        flex: 1,
        bottom: 4,
        //   justifyContent: "center",
        backgroundColor: "white",
        //   alignContent: "center",
    },
    fab: {
        position: 'absolute',
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        left: 30,
        bottom: 30,
        backgroundColor: 'orange',
        borderRadius: 5,
        borderColor: "black",
        elevation: 8
    },
    fabIcon: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },

})