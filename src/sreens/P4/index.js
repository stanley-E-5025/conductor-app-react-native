import React, {useState, useEffect} from 'react';
import {Text, View, Pressable, SafeAreaView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createCarInfo} from '../../graphql/mutation';
import {API, graphqlOperation, Auth} from 'aws-amplify';

import styles from './styles';

const P4 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const order = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      console.log(userInfo.username);

      const date = new Date();

      const input = {
        createdAt: date.toISOString(),
        type: userInfo.username,
        originLatitude: 0,
        originLongitude: 0,
        distance: 1,
        duration: 1,
        cost: 1,
        place: 1,
        status: 'NEW',
        destLatitude: 1,
        destLongitude: 1,
        nota: 'lllll',
        userId: 'stanly',
        carId: '1',
      };

      const response = await API.graphql(
        graphqlOperation(createCarInfo, {
          input,
        }),
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  const GOOGLE_MAPS_APIKEY = 'AIzaSyDC5YeK0OuXzBkkpcdYF71wTjtIGVV4NgE';
  const origins = {
    latitude: route.params.origenA,
    longitude: route.params.origenB,
  };

  const destination = {
    latitude: route.params.destinoA,
    longitude: route.params.destinoB,
  };

  const info = (event) => {
    setAllinfo({
      distance: event.distance,
      duration: event.duration,
    });
  };

  const MyCustomMarkerView = (marker) => {
    return (
      <View style={styles.custom}>
        <Text style={styles.text21}>A</Text>
      </View>
    );
  };
  const MyCustomMarkerViewB = (marker) => {
    return (
      <View style={styles.custom}>
        <Text style={styles.text21}>B</Text>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <MapView
        style={{height: '100%', width: '100%'}}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={false}
        showsUserLocation={true}
        showsCompass={false}
        initialRegion={{
          latitude: route.params.destinoA,
          longitude: route.params.destinoB,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: route.params.origenA,
            longitude: route.params.origenB,
          }}>
          <MyCustomMarkerView {...MyCustomMarkerView} />
        </Marker>
        <Marker
          coordinate={{
            latitude: route.params.destinoA,
            longitude: route.params.destinoB,
          }}>
          <MyCustomMarkerViewB {...MyCustomMarkerViewB} />
        </Marker>

        <MapViewDirections
          origin={origins}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#171717"
        />
      </MapView>

      <Pressable style={styles.back} onPress={() => navigation.navigate('P3')}>
        <Text>
          <Icon name="angle-left" size={30} color="#000000" />
        </Text>
      </Pressable>

      <Pressable style={styles.View}>
        <View style={styles.item2}>
          <Text>{route.params.place}</Text>
        </View>

        <View style={styles.item3}>
          <Text style={styles.title}>{route.params.name}</Text>
        </View>
        <View style={styles.item4}>
          <Text style={styles.title}>{route.params.cost} NIO </Text>
        </View>
        <View style={styles.item22}>
          <Text style={styles.title}>{route.params.nota}</Text>
        </View>
      </Pressable>

      <Pressable onPress={order} style={styles.acept}>
        <Text style={{color: '#ffffff'}}>
          <Icon name="check" size={17} color="#ffffff" /> aceptar orden
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default P4;
