import React, { Component, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View ,Text} from 'react-native';
import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

// const origin = {latitude: 37.3318456, longitude: -122.0296002};
// const destination = {latitude: 37.771707, longitude: -122.4053769};
// const GOOGLE_MAPS_APIKEY = 'AIzaSyC1kDDl0HLmFwXjS29OQQUCkCTMFMAEBVU';


// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;



const GoogleMap = ({ Longitude, Latitude ,setvisibleMap}) => {

  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [deltaLatittude, setdeltaLatittude] = useState('');
  const [deltaLongitude, setdeltaLongitude] = useState('');

  useEffect(() => {

    let minX, maxX, minY, maxY;

    minX = Latitude;
    maxX = Latitude;
    minY =  Longitude;
    maxY =  Longitude;

    minX = Math.min(minX, Latitude);
    maxX = Math.max(maxX, Latitude);
    minY = Math.min(minY,  Longitude);
    maxY = Math.max(maxY,  Longitude);

    setlatitude((minX + maxX) / 2);
    setlongitude((minY + maxY) / 2);
    setdeltaLatittude(maxX - minX);
    setdeltaLongitude(maxY - minY);

  }, [])

  return (
    <View style={styles.container}>
      <Text style={{color: 'black', fontSize: 40, padding: 10}} onPress={()=>{
        setvisibleMap(false);
      }}>Go back</Text>
      <View>
     <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: deltaLatittude,
          longitudeDelta: deltaLongitude,
        }}
      />
      </View>
    </View>
  );
}

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    marginTop: 40,
    width: '100%',
    height: '80%',
  },
});




  // constructor(props) {
  //   super(props);

  //   // AirBnB's Office, and Apple Park
  //   this.state = {
  //     coordinates: [
  //       {
  //         latitude: 37.3317876,
  //         longitude: -122.0054812,
  //       },
  //       {
  //         latitude: 37.771707,
  //         longitude: -122.4053769,
  //       },
  //     ],
  //   };

  //   this.mapView = null;
  // }

  // onMapPress = (e) => {
  //   this.setState({
  //     coordinates: [
  //       ...this.state.coordinates,
  //       e.nativeEvent.coordinate,
  //     ],
  //   });
  // }
  // {this.state.coordinates.map((coordinate, index) =>
  //   <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
  // )}
  // {(this.state.coordinates.length >= 2) && (
  //   <MapViewDirections
  //     origin={this.state.coordinates[0]}
  //     waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): undefined}
  //     destination={this.state.coordinates[this.state.coordinates.length-1]}
  //     apikey={GOOGLE_MAPS_APIKEY}
  //     strokeWidth={3}
  //     strokeColor="hotpink"
  //     optimizeWaypoints={true}
  //     onStart={(params) => {
  //       console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
  //     }}
  //     onReady={result => {
  //       console.log(`Distance: ${result.distance} km`)
  //       console.log(`Duration: ${result.duration} min.`)

  //       this.mapView.fitToCoordinates(result.coordinates, {
  //         edgePadding: {
  //           right: (width / 20),
  //           bottom: (height / 20),
  //           left: (width / 20),
  //           top: (height / 20),
  //         }
  //       });
  //     }}
  //     onError={(errorMessage) => {
  //       // console.log('GOT AN ERROR');
  //     }}
  //   />
  // )}