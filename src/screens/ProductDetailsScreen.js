import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  FlatList,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImagePlaceholder from '../components/ImagePlaceholder';

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['#000', '#4A90E2', '#F5A623', '#D0021B'];

  const handleShare = () => {
    Share.share({
      message: `Découvrez ${product.name} sur ChatMa Market!`,
    });
  };

  const handleAddToCart = () => {
    // TODO: Implémenter l'ajout au panier
    Alert.alert('Succès', 'Produit ajouté au panier');
  };

  const renderImageGallery = () => {
    return (
      <Modal
        visible={showImageGallery}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageGallery(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageGallery(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.imageCounter}>
              {currentImageIndex + 1}/{product.images.length}
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.modalImageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />

          <View style={styles.thumbnailContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                    setCurrentImageIndex(index);
                  }}
                  style={[
                    styles.thumbnail,
                    currentImageIndex === index && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setShowImageGallery(true)}
        >
          {product.images && product.images.length > 0 ? (
            <Image
              source={{ uri: product.images[currentImageIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <ImagePlaceholder size={width} />
          )}
          {product.images && product.images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1}/{product.images.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}€</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.badgeText}>4.5</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="eye" size={12} color="#666" />
                <Text style={styles.badgeText}>2.1k</Text>
              </View>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.sellerContainer}>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={16} color="#666" />
              </View>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
            </View>
            <View style={styles.sellerRating}>
              <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{product.description}</Text>
          
          {product.colors && product.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Couleurs disponibles</Text>
              <View style={styles.colorOptions}>
                {product.colors.map((color, index) => (
                  <View key={index} style={[styles.colorOption, { backgroundColor: color }]} />
                ))}
              </View>
            </View>
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tailles disponibles</Text>
              <View style={styles.sizeOptions}>
                {product.sizes.map((size, index) => (
                  <View key={index} style={styles.sizeOption}>
                    <Text style={styles.sizeText}>{size}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.storeButton}
          onPress={() => navigation.navigate('Store', {
            storeId: product.sellerId,
            storeName: product.sellerName
          })}
        >
          <Ionicons name="storefront-outline" size={18} color="#4CAF50" />
          <Text style={styles.buttonText}>Boutique</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => navigation.navigate('MarketChat', {
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            productId: product.id,
            productName: product.name
          })}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#2196F3" />
          <Text style={[styles.buttonText, { color: '#2196F3' }]}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={18} color="#4CAF50" />
          <Text style={styles.buttonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>

      {renderImageGallery()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  storeButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalImageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: height * 0.8,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#4CAF50',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProductDetailsScreen;
