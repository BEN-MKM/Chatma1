import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { useProduct } from '../contexts/ProductContext';
import { useSeller } from '../contexts/SellerContext';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, navigation }) => {
  const hasImages = product.images && product.images.length > 0;
  
  const handleStorePress = (e) => {
    e.stopPropagation();
    navigation.navigate('Store', {
      storeId: product.sellerId,
      storeName: product.sellerName
    });
  };

  const handleContactPress = (e) => {
    e.stopPropagation();
    navigation.navigate('MarketChat', {
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      productId: product.id,
      productName: product.name
    });
  };

  return (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => navigation.navigate('ProductDetails', { product })}
    >
      <View style={styles.imageContainer}>
        {hasImages ? (
          <Image source={{ uri: product.images[0] }} style={styles.productImage} />
        ) : (
          <ImagePlaceholder style={styles.productImage} />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price} €</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.productActions}>
          <TouchableOpacity onPress={handleStorePress} style={styles.actionButton}>
            <Ionicons name="storefront-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionText}>{product.sellerName}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContactPress} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#2196F3" />
            <Text style={styles.actionText}>Contacter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MarketScreen = ({ navigation }) => {
  const { products, loading, error, loadProducts, searchProducts } = useProduct();
  const { seller } = useSeller();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [showOptions, setShowOptions] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(2);
  const [searching, setSearching] = useState(false);

  // Utiliser useCallback pour mémoriser la fonction loadProducts
  const memoizedLoadProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Utiliser la fonction mémorisée dans useEffect
  useEffect(() => {
    memoizedLoadProducts();
  }, [memoizedLoadProducts]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setSearching(true);
      try {
        const result = await searchProducts(searchQuery);
        if (!result.success) {
          Alert.alert('Erreur', 'Une erreur est survenue lors de la recherche');
        }
      } finally {
        setSearching(false);
      }
    } else {
      memoizedLoadProducts();
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedCategory !== 'tout' && product.category !== selectedCategory) {
        return false;
      }
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.sellerName.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const categories = [
    { id: 'tout', name: 'Tout' },
    { id: 'tech', name: 'Tech' },
    { id: 'mode', name: 'Mode' },
    { id: 'maison', name: 'Maison' },
    { id: 'scolaire', name: 'Scolaire' },
  ];

  const renderOptionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showOptions}
      onRequestClose={() => setShowOptions(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowOptions(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              navigation.navigate('MyShop');
              setShowOptions(false);
            }}
          >
            <Ionicons name="storefront-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Ma Boutique</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {seller?.status === 'approved' && (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                navigation.navigate('AddProduct');
                setShowOptions(false);
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.optionText}>Ajouter un produit</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              navigation.navigate('Cart');
              setShowOptions(false);
            }}
          >
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Mon panier</Text>
            {cartItemCount > 0 && (
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              navigation.navigate('Delivery');
              setShowOptions(false);
            }}
          >
            <Ionicons name="bicycle-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Livraison</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              navigation.navigate('MarketSettings');
              setShowOptions(false);
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={['#007AFF', '#5856D6']}
      style={styles.headerContainer}
    >
      <BlurView intensity={20} style={styles.headerBlur}>
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.headerTitle}>ChatMa Market</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Cart')} 
              style={styles.headerIcon}
            >
              <Ionicons name="cart-outline" size={24} color="white" />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowOptions(true)} 
              style={styles.headerIcon}
            >
              <Ionicons name="menu-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BlurView>
    </LinearGradient>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searching && (
        <ActivityIndicator size="small" color="#007AFF" style={styles.searchingIndicator} />
      )}
    </View>
  );

  const renderCategoryList = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryList}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategory === category.id && styles.categoryItemActive
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading && !searching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Une erreur est survenue lors du chargement des produits.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={memoizedLoadProducts}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderOptionsModal()}
      <View style={styles.content}>
        {renderSearchBar()}
        {renderCategoryList()}
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} navigation={navigation} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                Aucun produit trouvé
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 0,
  },
  headerBlur: {
    padding: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchingIndicator: {
    marginLeft: 10,
  },
  categoryList: {
    maxHeight: 50,
  },
  categoryContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryItemActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 120,
    height: 120,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  modalBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default MarketScreen;
