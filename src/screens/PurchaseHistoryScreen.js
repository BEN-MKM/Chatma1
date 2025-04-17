import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PurchaseHistoryScreen = ({ navigation }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  // Simuler le chargement des achats
  const loadPurchases = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPurchases = Array.from({ length: 20 }, (_, index) => ({
        id: `order-${index + 1}`,
        productName: `Produit ${index + 1}`,
        price: Math.floor(Math.random() * 200) + 10,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        seller: {
          name: `Vendeur ${index + 1}`,
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`
        },
        image: `https://picsum.photos/200/200?random=${index}`
      }));

      setPurchases(mockPurchases);
    } catch (error) {
      console.error('Erreur lors du chargement des achats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPurchases();
  }, [loadPurchases]);

  React.useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const filteredPurchases = purchases.filter(purchase => 
    filter === 'all' ? true : purchase.status === filter
  );

  const renderPurchaseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.purchaseItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.purchaseInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.price}>{item.price} €</Text>
        <Text style={styles.date}>
          {item.date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
        <View style={styles.sellerInfo}>
          <Image source={{ uri: item.seller.avatar }} style={styles.sellerAvatar} />
          <Text style={styles.sellerName}>{item.seller.name}</Text>
        </View>
      </View>
      <View style={[styles.status, {
        backgroundColor: item.status === 'pending' ? '#FFF3E0' :
                        item.status === 'completed' ? '#E8F5E9' : '#FFEBEE'
      }]}>
        <Text style={[styles.statusText, {
          color: item.status === 'pending' ? '#F57C00' :
                 item.status === 'completed' ? '#388E3C' : '#D32F2F'
        }]}>
          {item.status === 'pending' ? 'En cours' :
           item.status === 'completed' ? 'Terminé' : 'Annulé'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filterName, label) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterName && styles.activeFilter]}
      onPress={() => setFilter(filterName)}
    >
      <Text style={[styles.filterText, filter === filterName && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Tous')}
        {renderFilterButton('pending', 'En cours')}
        {renderFilterButton('completed', 'Terminés')}
        {renderFilterButton('cancelled', 'Annulés')}
      </View>
      
      <FlatList
        data={filteredPurchases}
        renderItem={renderPurchaseItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    padding: 10,
  },
  purchaseItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  purchaseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sellerName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default PurchaseHistoryScreen;
