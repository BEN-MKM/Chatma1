import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { supabase } from '../services/supabase';

const categories = [
  { id: 1, name: 'Électronique', icon: 'phone-portrait' },
  { id: 2, name: 'Mode', icon: 'shirt' },
  { id: 3, name: 'Maison', icon: 'home' },
  { id: 4, name: 'Sports', icon: 'football' },
  { id: 5, name: 'Loisirs', icon: 'game-controller' },
  { id: 6, name: 'Autres', icon: 'grid' },
];

const CreateListingScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(state => state.auth.user);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      if (images.length + newImages.length <= 5) {
        setImages([...images, ...newImages]);
      } else {
        Alert.alert('Limite atteinte', 'Vous pouvez sélectionner jusqu’à 5 images maximum.');
      }
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description.');
      return false;
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide.');
      return false;
    }
    if (!selectedCategory) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie.');
      return false;
    }
    if (images.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins une image.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Upload images to Supabase Storage
      const imageUrls = await Promise.all(images.map(async (uri) => {
        // Implement image upload logic here
        return uri; // Temporary return the local URI
      }));

      // TODO: Create listing in Supabase
      const listing = {
        user_id: currentUser.id,
        title,
        description,
        price: parseFloat(price),
        category_id: selectedCategory,
        images: imageUrls,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de l\'annonce.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle annonce</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.submitButton, loading && styles.disabledButton]}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Publication...' : 'Publier'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.imageSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <Ionicons name="camera" size={30} color="#8E8E93" />
                  <Text style={styles.addImageText}>
                    {images.length === 0 ? 'Ajouter des photos' : 'Ajouter'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={styles.formSection}>
            <TextInput
              style={styles.titleInput}
              placeholder="Titre de l'annonce"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Prix"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Ionicons
                      name={category.icon}
                      size={24}
                      color={selectedCategory === category.id ? '#FFFFFF' : '#000000'}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category.id && styles.selectedCategoryText
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.descriptionInput}
              placeholder="Description détaillée du produit"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={1000}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#2BAE66',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  formSection: {
    padding: 15,
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 10,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 15,
  },
  currencySymbol: {
    fontSize: 20,
    color: '#2BAE66',
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 10,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#2BAE66',
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  descriptionInput: {
    fontSize: 16,
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
  },
});

export default CreateListingScreen;
