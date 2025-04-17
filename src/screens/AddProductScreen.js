import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { useProduct } from '../contexts/ProductContext';
import { useSeller } from '../contexts/SellerContext';

const AddProductScreen = ({ navigation }) => {
  const { addProduct } = useProduct();
  const { sellerStatus } = useSeller();
  const [productImages, setProductImages] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    specifications: {
      material: '',
      style: '',
      care: '',
      origin: ''
    }
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const availableColors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Rouge', value: '#FF0000' },
    { name: 'Bleu', value: '#2196F3' },
    { name: 'Jaune', value: '#FFEB3B' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    if (sellerStatus.verificationStatus !== 'verified') {
      navigation.replace('BecomeSeller');
    }
  }, [navigation, sellerStatus.verificationStatus]);

  if (sellerStatus.verificationStatus !== 'verified') {
    return null;
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProductImages([...productImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'image. Veuillez réessayer.');
    }
  };

  const removeImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const toggleColor = (color) => {
    if (selectedColors.includes(color.value)) {
      setSelectedColors(selectedColors.filter(c => c !== color.value));
    } else {
      setSelectedColors([...selectedColors, color.value]);
    }
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSave = () => {
    if (!productData.name || !productData.price || !productData.description || productImages.length === 0) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires et ajouter au moins une image.');
      return;
    }

    const newProduct = {
      ...productData,
      images: productImages,
      colors: selectedColors,
      sizes: selectedSizes,
      createdAt: new Date().toISOString(),
    };

    addProduct(newProduct);

    Alert.alert(
      'Succès',
      'Produit ajouté avec succès !',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un produit</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Publier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Images du produit */}
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Photos du produit</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {productImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <ImagePlaceholder 
                  size={100} 
                  imageUri={uri}
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={pickImage}
            >
              <Ionicons name="add" size={40} color="#4CAF50" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du produit"
            value={productData.name}
            onChangeText={(text) => setProductData({...productData, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix (€)"
            value={productData.price}
            onChangeText={(text) => setProductData({...productData, price: text})}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description du produit"
            value={productData.description}
            onChangeText={(text) => setProductData({...productData, description: text})}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Couleurs disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleurs disponibles</Text>
          <View style={styles.optionsContainer}>
            {availableColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  selectedColors.includes(color.value) && styles.colorOptionSelected
                ]}
                onPress={() => toggleColor(color)}
              >
                {selectedColors.includes(color.value) && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={color.value === '#FFFFFF' || color.value === '#FFEB3B' ? '#000' : '#FFF'} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tailles disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tailles disponibles</Text>
          <View style={styles.optionsContainer}>
            {availableSizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sizeOption,
                  selectedSizes.includes(size) && styles.sizeOptionSelected
                ]}
                onPress={() => toggleSize(size)}
              >
                <Text style={[
                  styles.sizeOptionText,
                  selectedSizes.includes(size) && styles.sizeOptionTextSelected
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spécifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spécifications</Text>
          <TextInput
            style={styles.input}
            placeholder="Matériau"
            value={productData.specifications.material}
            onChangeText={(text) => setProductData({
              ...productData,
              specifications: {...productData.specifications, material: text}
            })}
          />
          <TextInput
            style={styles.input}
            placeholder="Style"
            value={productData.specifications.style}
            onChangeText={(text) => setProductData({
              ...productData,
              specifications: {...productData.specifications, style: text}
            })}
          />
          <TextInput
            style={styles.input}
            placeholder="Entretien"
            value={productData.specifications.care}
            onChangeText={(text) => setProductData({
              ...productData,
              specifications: {...productData.specifications, care: text}
            })}
          />
          <TextInput
            style={styles.input}
            placeholder="Origine"
            value={productData.specifications.origin}
            onChangeText={(text) => setProductData({
              ...productData,
              specifications: {...productData.specifications, origin: text}
            })}
          />
        </View>
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
  saveButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  imagesSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  sizeOption: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  sizeOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sizeOptionText: {
    fontSize: 16,
    color: '#000',
  },
  sizeOptionTextSelected: {
    color: '#fff',
  },
});

export default AddProductScreen;
