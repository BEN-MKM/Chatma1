import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSeller } from '../contexts/SellerContext';
import { useProduct } from '../contexts/ProductContext';
import ImagePlaceholder from '../components/ImagePlaceholder';

const MyShopScreen = ({ navigation }) => {
  const { seller, loading: sellerLoading } = useSeller();
  const { products, loading: productsLoading } = useProduct();

  const myProducts = products.filter(product => 
    product.seller_id === seller?.id || product.sellerId === seller?.id
  );

  // Afficher le chargement
  if (sellerLoading || productsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  // Si l'utilisateur n'est pas encore vendeur
  if (!seller) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ma Boutique</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.unverifiedContainer}>
          <Ionicons name="storefront-outline" size={80} color="#666" />
          <Text style={styles.unverifiedTitle}>Devenez Vendeur</Text>
          <Text style={styles.unverifiedText}>
            Pour créer votre boutique et commencer à vendre vos produits, vous devez d'abord devenir vendeur.
          </Text>
          <TouchableOpacity
            style={styles.becomeSellerButton}
            onPress={() => navigation.navigate('BecomeSeller')}
          >
            <Text style={styles.becomeSellerButtonText}>Devenir Vendeur</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Si la demande est en cours de traitement
  if (seller?.status === 'pending') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ma Boutique</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.pendingContainer}>
          <Ionicons name="time" size={80} color="#FFC107" />
          <Text style={styles.pendingTitle}>Demande en cours</Text>
          <Text style={styles.pendingText}>
            Votre demande pour devenir vendeur est en cours d'examen. 
            Vous pourrez accéder à votre boutique une fois votre compte vérifié.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ma Boutique</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
          <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {myProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={80} color="#666" />
          <Text style={styles.emptyTitle}>Aucun produit</Text>
          <Text style={styles.emptyText}>
            Vous n'avez pas encore ajouté de produits à votre boutique.
          </Text>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.addProductButtonText}>Ajouter un produit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => navigation.navigate('EditProduct', { product: item })}
            >
              {item.images && item.images.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
              ) : (
                <ImagePlaceholder style={styles.productImage} />
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} €</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProduct', { product: item })}
              >
                <Ionicons name="create-outline" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.productList}
        />
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  unverifiedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unverifiedTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  unverifiedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  becomeSellerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  becomeSellerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  pendingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  addProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productList: {
    padding: 15,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    padding: 10,
  },
});

export default MyShopScreen;
