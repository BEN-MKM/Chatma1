import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SellerStoreScreen = ({ route, navigation }) => {
  const { sellerId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    name: "Tech Store",
    avatar: "https://picsum.photos/id/1/200/200",
    rating: 4.8,
    followers: "2.5k",
    products: "156",
    description: "Produits électroniques de qualité à prix compétitifs",
    banner: "https://picsum.photos/id/2/800/300",
    badges: ["Vendeur Certifié", "Expédition Rapide", "Service Premium"],
  });

  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Écouteurs Bluetooth Pro',
      price: '59.99',
      originalPrice: '99.99',
      sales: '1.2k vendus',
      image: 'https://picsum.photos/id/3/200/200',
      discount: '-40%',
    },
    {
      id: '2',
      name: 'Chargeur Sans Fil 15W',
      price: '29.99',
      originalPrice: '49.99',
      sales: '856 vendus',
      image: 'https://picsum.photos/id/4/200/200',
      discount: '-40%',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('products');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Chat', { 
              sellerId,
              sellerName: storeInfo.name 
            })}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#FF4D4F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('StoreReport', { sellerId })}
          >
            <Ionicons name="flag-outline" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, sellerId, storeInfo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simuler un chargement
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const renderProduct = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>€{item.price}</Text>
          <Text style={styles.originalPrice}>€{item.originalPrice}</Text>
        </View>
        <Text style={styles.sales}>{item.sales}</Text>
      </View>
      <View style={styles.discountTag}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={{ uri: storeInfo.banner }} style={styles.banner} />
        
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <Image source={{ uri: storeInfo.avatar }} style={styles.avatar} />
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{storeInfo.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{storeInfo.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Suivre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('ProductManagement')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FF4D4F" />
              <Text style={styles.manageButtonText}>Nouveau produit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{storeInfo.followers}</Text>
              <Text style={styles.statLabel}>Abonnés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{storeInfo.products}</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>
          </View>

          <Text style={styles.description}>{storeInfo.description}</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.badgesContainer}
          >
            {storeInfo.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
            onPress={() => setSelectedTab('products')}
          >
            <Text style={[styles.tabText, selectedTab === 'products' && styles.activeTabText]}>
              Produits
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'categories' && styles.activeTab]}
            onPress={() => setSelectedTab('categories')}
          >
            <Text style={[styles.tabText, selectedTab === 'categories' && styles.activeTabText]}>
              Catégories
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.productGrid}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  banner: {
    width: '100%',
    height: 150,
  },
  storeInfo: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  manageButtonText: {
    color: '#FF4D4F',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
    marginHorizontal: 30,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  description: {
    marginTop: 15,
    color: '#666',
    lineHeight: 20,
  },
  badgesContainer: {
    marginTop: 15,
  },
  badge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  badgeText: {
    color: '#FF4D4F',
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4D4F',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#FF4D4F',
    fontWeight: 'bold',
  },
  productGrid: {
    padding: 5,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4D4F',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  sales: {
    fontSize: 12,
    color: '#666',
  },
  discountTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4D4F',
    padding: 4,
    borderBottomLeftRadius: 8,
  },
  discountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SellerStoreScreen;
