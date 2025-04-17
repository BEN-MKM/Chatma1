import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

const MarketSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');

  const categories = [
    { id: 'all', name: 'Tout', icon: 'grid-outline' },
    { id: 'tech', name: 'Tech', icon: 'phone-portrait-outline' },
    { id: 'mode', name: 'Mode', icon: 'shirt-outline' },
    { id: 'maison', name: 'Maison', icon: 'home-outline' },
  ];

  const sortOptions = [
    { id: 'relevance', name: 'Pertinence' },
    { id: 'price_asc', name: 'Prix croissant' },
    { id: 'price_desc', name: 'Prix décroissant' },
    { id: 'newest', name: 'Plus récent' },
  ];

  const handleSearch = () => {
    // TODO: Implémenter la recherche avec les filtres
    console.log('Recherche avec:', {
      query: searchQuery,
      category: selectedCategory,
      priceRange,
      sortBy,
    });
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
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
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
                size={20}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              />
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

        <Text style={styles.sectionTitle}>Fourchette de prix</Text>
        <View style={styles.priceRangeContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min"
            keyboardType="numeric"
            value={priceRange.min}
            onChangeText={(value) => setPriceRange({ ...priceRange, min: value })}
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max"
            keyboardType="numeric"
            value={priceRange.max}
            onChangeText={(value) => setPriceRange({ ...priceRange, max: value })}
          />
        </View>

        <Text style={styles.sectionTitle}>Trier par</Text>
        <View style={styles.sortOptionsContainer}>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortButton,
                sortBy === option.id && styles.sortButtonActive
              ]}
              onPress={() => setSortBy(option.id)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.id && styles.sortButtonTextActive
                ]}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleSearch}
      >
        <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  filtersContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    gap: 8,
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
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  sortButtonActive: {
    backgroundColor: '#4CAF50',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  applyButton: {
    margin: 16,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MarketSearchScreen;
