import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  {
    id: 'tech',
    name: 'Tech',
    icon: 'phone-portrait-outline',
    subCategories: [
      { id: 'smartphones', name: 'Smartphones' },
      { id: 'laptops', name: 'Ordinateurs portables' },
      { id: 'tablets', name: 'Tablettes' },
      { id: 'accessories', name: 'Accessoires' },
    ],
  },
  {
    id: 'mode',
    name: 'Mode',
    icon: 'shirt-outline',
    subCategories: [
      { id: 'men', name: 'Homme' },
      { id: 'women', name: 'Femme' },
      { id: 'kids', name: 'Enfants' },
      { id: 'accessories', name: 'Accessoires' },
    ],
  },
  {
    id: 'maison',
    name: 'Maison',
    icon: 'home-outline',
    subCategories: [
      { id: 'furniture', name: 'Meubles' },
      { id: 'decoration', name: 'Décoration' },
      { id: 'kitchen', name: 'Cuisine' },
      { id: 'garden', name: 'Jardin' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauté',
    icon: 'color-palette-outline',
    subCategories: [
      { id: 'makeup', name: 'Maquillage' },
      { id: 'skincare', name: 'Soin de la peau' },
      { id: 'haircare', name: 'Soin des cheveux' },
      { id: 'fragrance', name: 'Parfums' },
    ],
  },
];

const MarketCategoriesScreen = ({ navigation }) => {
  const handleCategoryPress = (category, subCategory = null) => {
    navigation.navigate('MarketSearch', {
      category: category.id,
      subCategory: subCategory?.id,
    });
  };

  const renderCategory = (category) => (
    <View key={category.id} style={styles.categorySection}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => handleCategoryPress(category)}
      >
        <Ionicons name={category.icon} size={24} color="#333" />
        <Text style={styles.categoryName}>{category.name}</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      <View style={styles.subCategoriesContainer}>
        {category.subCategories.map((subCategory) => (
          <TouchableOpacity
            key={subCategory.id}
            style={styles.subCategoryButton}
            onPress={() => handleCategoryPress(category, subCategory)}
          >
            <Text style={styles.subCategoryText}>{subCategory.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
        <Text style={styles.title}>Catégories</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('MarketSearch')}
        >
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {categories.map(renderCategory)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  subCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  subCategoryButton: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MarketCategoriesScreen;
