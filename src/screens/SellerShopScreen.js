import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImagePlaceholder from '../components/ImagePlaceholder';

const SellerShopScreen = ({ navigation, route }) => {
  const { seller } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await loadImages();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const products = [
    {
      id: '1',
      name: 'Smartphone XYZ',
      price: '499.99',
      description: 'Un smartphone puissant avec une excellente caméra',
      category: 'Tech',
    },
    {
      id: '2',
      name: 'Casque Audio Pro',
      price: '199.99',
      description: 'Un casque audio de haute qualité avec réduction de bruit',
      category: 'Tech',
    },
    {
      id: '3',
      name: 'Montre Connectée',
      price: '299.99',
      description: 'Une montre intelligente avec suivi d\'activité',
      category: 'Tech',
    },
    {
      id: '4',
      name: 'Tablette 10"',
      price: '399.99',
      description: 'Une tablette performante pour tous vos besoins',
      category: 'Tech',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{seller?.name || "Boutique"}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.shopInfo}>
          <View style={styles.shopImageContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <ImagePlaceholder size={100} icon="storefront-outline" />
            )}
          </View>
          <Text style={styles.shopName}>{seller?.name}</Text>
          <Text style={styles.shopDescription}>
            Bienvenue dans notre boutique ! Nous proposons une large gamme de produits tech de qualité.
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{seller?.rating}</Text>
              <Text style={styles.statLabel}>Note</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Ventes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Nos produits</Text>
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetails', { product })}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <View style={styles.productImageContainer}>
                    <ImagePlaceholder size={180} />
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>€{product.price}</Text>
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate('MarketChat', { seller })}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contacter le vendeur</Text>
        </TouchableOpacity>
      </View>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  shopInfo: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shopImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  productsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  productCard: {
    width: '50%',
    padding: 5,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SellerShopScreen;
