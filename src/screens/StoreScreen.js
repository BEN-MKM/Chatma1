import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImagePlaceholder from '../components/ImagePlaceholder';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

const StoreScreen = ({ navigation, route }) => {
  const { storeId, storeName } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = [
    { id: 'all', name: 'Tout', icon: 'grid-outline' },
    { id: 'tech', name: 'Tech', icon: 'phone-portrait-outline' },
    { id: 'mode', name: 'Mode', icon: 'shirt-outline' },
    { id: 'maison', name: 'Maison', icon: 'home-outline' },
  ];

  const loadProducts = () => {
    // TODO: Charger les produits du vendeur depuis l'API
    setProducts([
      {
        id: '1',
        name: 'Smartphone XYZ',
        price: 499.99,
        description: 'Un smartphone puissant avec une excellente caméra',
        category: 'tech',
        rating: 4.5,
        views: 1200,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        ],
      },
      {
        id: '2',
        name: 'Casque Audio Pro',
        price: 199.99,
        description: 'Un casque audio de haute qualité avec réduction de bruit',
        category: 'tech',
        rating: 4.8,
        views: 800,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        ],
      },
      {
        id: '3',
        name: 'Montre Connectée',
        price: 299.99,
        description: 'Une montre intelligente avec suivi d\'activité',
        category: 'mode',
        rating: 4.2,
        views: 650,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        ],
      },
      {
        id: '4',
        name: 'Tablette 10"',
        price: 399.99,
        description: 'Une tablette performante pour tous vos besoins',
        category: 'tech',
        rating: 4.6,
        views: 920,
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        ],
      },
    ]);
  };

  useEffect(() => {
    loadProducts();
  }, [storeId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
    setIsRefreshing(false);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleShare = () => {
    Share.share({
      message: `Découvrez la boutique ${storeName} sur ChatMa Market!`,
    });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <ImagePlaceholder size={itemWidth} />
        )}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{item.price}€</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.productStats}>
          <View style={styles.stat}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={14} color="#666" />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>Aucun produit dans cette catégorie</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Boutique</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.storeInfo}>
        <View style={styles.storeAvatar}>
          <Ionicons name="storefront" size={24} color="#666" />
        </View>
        <View style={styles.storeDetails}>
          <Text style={styles.storeName}>{storeName}</Text>
          <View style={styles.storeStats}>
            <View style={styles.stat}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>4.8</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="cube" size={16} color="#666" />
              <Text style={styles.statText}>{products.length} produits</Text>
            </View>
            <View style={[styles.stat, styles.activeStatus]}>
              <Ionicons name="ellipse" size={8} color="#4CAF50" />
              <Text style={[styles.statText, { color: '#4CAF50' }]}>Actif</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categories}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? '#fff' : '#666'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => navigation.navigate('MarketChat', {
          sellerId: storeId,
          sellerName: storeName,
        })}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        <Text style={styles.contactButtonText}>Contacter le vendeur</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  storeInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  storeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  storeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  activeStatus: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categories: {
    padding: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  productList: {
    padding: gap,
    flexGrow: 1,
  },
  productCard: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: gap,
    marginHorizontal: gap / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: itemWidth,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  priceTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productStats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  contactButton: {
    margin: 16,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoreScreen;
