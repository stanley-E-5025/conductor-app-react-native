import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {listCarInfos} from '../../graphql/query';
import {onCreateCarInfo} from '../../graphql/real-time-order';

import {API, Auth, graphqlOperation} from 'aws-amplify';
import styles from './styles';

const P5 = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    const updateUsercar = async () => {
      // GET USER
      const userInfo = await Auth.currentAuthenticatedUser();
      setEmail(userInfo.attributes.email);
      setName(userInfo.username);
    };

    updateUsercar();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orderData = await API.graphql(
        graphqlOperation(listCarInfos, {filter: {type: {eq: name}}}),
      );
      setNewOrders(orderData.data.listCarInfos.items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const realTime = API.graphql(graphqlOperation(onCreateCarInfo)).subscribe({
      next: (data) => {
        fetchOrders();
      },
    });
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.item2}>
        <Text style={styles.infoPlace}>{item.place}</Text>
      </View>

      <View style={styles.item3}>
        <Text style={styles.name}>{item.type}</Text>
      </View>
      <View style={styles.item4}>
        <Text style={styles.title}>{item.cost} NIO </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView>
      <View style={styles.root}>
        <View style={styles.user}></View>
        <Text style={styles.txt}>{name}</Text>
        <Text style={styles.txt}>{email}</Text>
      </View>

      <View style={styles.view}>
        <FlatList
          data={newOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default P5;
