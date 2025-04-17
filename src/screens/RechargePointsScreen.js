import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RechargePointsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const rechargePoints = [
    {
      id: '1',
      name: 'Tabac Presse du Centre',
      address: '15 Rue de la République',
      city: 'Paris',
      distance: '0.5',
      hours: '8h-20h',
      status: 'open'
    },
    {
      id: '2',
      name: 'Supermarché Express',
      address: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      distance: '1.2',
      hours: '7h-22h',
      status: 'open'
    },
    {
      id: '3',
      name: 'Kiosque Saint-Michel',
      address: '8 Place Saint-Michel',
      city: 'Paris',
      distance: '2.0',
      hours: '9h-19h',
      status: 'closed'
    },
    {
      id: '4',
      name: 'Station Service Total',
      address: '120 Boulevard Haussmann',
      city: 'Paris',
      distance: '2.5',
      hours: '24h/24',
      status: 'open'
    }
  ];

  const filteredPoints = rechargePoints.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPoint = ({ item }) => (
    <TouchableOpacity
      style={styles.pointItem}
      onPress={() => navigation.navigate('RechargePointDetail', { point: item })}
    >
      <View style={styles.pointInfo}>
        <Text style={styles.pointName}>{item.name}</Text>
        <Text style={styles.pointAddress}>{item.address}</Text>
        <Text style={styles.pointCity}>{item.city}</Text>
        <View style={styles.pointDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.hours}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.distance} km</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'open' ? '#34C759' : '#FF3B30' }
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'open' ? 'Ouvert' : 'Fermé'}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Points de Recharge</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un point de recharge"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPoints}
        renderItem={renderPoint}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  pointAddress: {
    fontSize: 14,
    color: '#666',
  },
  pointCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pointDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RechargePointsScreen;
