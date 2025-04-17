import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const WishlistScreen = ({ navigation }) => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Écouteurs sans fil',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://picsum.photos/200',
      seller: 'TechStore',
      inStock: true,
    },
    {
      id: '2',
      name: 'Montre connectée',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://picsum.photos/201',
      seller: 'ElectroShop',
      inStock: true,
    },
    {
      id: '3',
      name: 'Enceinte Bluetooth',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://picsum.photos/202',
      seller: 'AudioPro',
      inStock: false,
    },
  ]);

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Retirer de la liste',
      'Voulez-vous retirer cet article de votre liste de souhaits ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Retirer',
          onPress: () => {
            setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleAddToCart = (item) => {
    // Implémenter l'ajout au panier ici
    Alert.alert('Succès', 'Article ajouté au panier');
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.sellerName}>Vendu par {item.seller}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>€{item.originalPrice.toFixed(2)}</Text>
          )}
        </View>
        {!item.inStock && (
          <Text style={styles.outOfStock}>Rupture de stock</Text>
        )}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddToCart(item)}
          style={[styles.cartButton, !item.inStock && styles.cartButtonDisabled]}
          disabled={!item.inStock}
        >
          <Ionicons name="cart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#999" />
      <Text style={styles.emptyText}>Votre liste de souhaits est vide</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Market')}
      >
        <Text style={styles.shopButtonText}>Parcourir la boutique</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liste de souhaits</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyWishlist}
      />
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  actionsContainer: {
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  removeButton: {
    padding: 5,
  },
  cartButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  cartButtonDisabled: {
    backgroundColor: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WishlistScreen;
