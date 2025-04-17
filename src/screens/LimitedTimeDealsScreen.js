import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import LimitedTimeDeals from '../components/LimitedTimeDeals';

const LimitedTimeDealsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [deals, setDeals] = useState([
    {
      id: '1',
      name: 'Écouteurs Sans Fil Premium',
      price: 79.99,
      originalPrice: 199.99,
      image: 'https://picsum.photos/id/1/400/300',
      currentStock: 45,
      totalStock: 100,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
    },
    {
      id: '2',
      name: 'Montre Connectée Sport',
      price: 129.99,
      originalPrice: 299.99,
      image: 'https://picsum.photos/id/2/400/300',
      currentStock: 28,
      totalStock: 50,
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12h from now
    },
    {
      id: '3',
      name: 'Enceinte Bluetooth Portable',
      price: 49.99,
      originalPrice: 89.99,
      image: 'https://picsum.photos/id/3/400/300',
      currentStock: 15,
      totalStock: 75,
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8h from now
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un rafraîchissement des données
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleDealPress = (deal) => {
    navigation.navigate('ProductDetails', { 
      productId: deal.id,
      isLimitedTimeDeal: true,
    });
  };

  const categorizedDeals = {
    tech: deals.filter(deal => deal.id === '1' || deal.id === '3'),
    sport: deals.filter(deal => deal.id === '2'),
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offres Flash du Jour</Text>
        <Text style={styles.headerSubtitle}>
          Ne manquez pas ces offres exceptionnelles !
        </Text>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Tech & Audio</Text>
        <LimitedTimeDeals
          deals={categorizedDeals.tech}
          onDealPress={handleDealPress}
        />
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Sport & Fitness</Text>
        <LimitedTimeDeals
          deals={categorizedDeals.sport}
          onDealPress={handleDealPress}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  categorySection: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
});

export default LimitedTimeDealsScreen;
