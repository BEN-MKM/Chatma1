import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImagePlaceholder from '../components/ImagePlaceholder';

const SearchResultsScreen = ({ navigation, route }) => {
  const { results = [] } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Résultats de recherche</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchByImage')}>
          <Ionicons name="camera-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {results.length > 0 ? (
          <View style={styles.resultsGrid}>
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultCard}
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
              >
                <View style={styles.imageContainer}>
                  <ImagePlaceholder size={200} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>€{item.price}</Text>
                  {item.similarity && (
                    <View style={styles.similarityContainer}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.similarityText}>
                        {item.similarity} de correspondance
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('MarketChat', { 
                      seller: { id: item.id, name: 'Vendeur' } 
                    })}
                  >
                    <Text style={styles.buttonText}>CONTACTER</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>
              Aucun résultat trouvé
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryButtonText}>
                Réessayer avec une autre image
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  resultsGrid: {
    padding: 10,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  similarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarityText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
  },
  buttonContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SearchResultsScreen;
