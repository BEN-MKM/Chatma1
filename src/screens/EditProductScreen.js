import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, deleteFile } from '../utils/storageUtils';

const EditProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
    category: '',
    condition: 'new',
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;

        if (product) {
          setProduct(product);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        Alert.alert('Error', 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = [...product.images];
        const imageUrl = await uploadFile(result.assets[0].uri, 'products');
        newImages.push(imageUrl);
        setProduct({ ...product, images: newImages });
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const images = [...product.images];
      const imageUrl = images[index];
      await deleteFile(imageUrl, 'products');
      images.splice(index, 1);
      setProduct({ ...product, images });
    } catch (error) {
      console.error('Erreur suppression image:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'image');
    }
  };

  const handleSave = async () => {
    if (!product.title || !product.price) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: product.title,
          description: product.description,
          price: parseFloat(product.price),
          images: product.images,
          category: product.category,
          condition: product.condition,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) throw error;
      navigation.goBack();
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le produit');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Titre*</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
          value={product.title}
          onChangeText={(text) => setProduct({ ...product, title: text })}
          placeholder="Titre du produit"
          placeholderTextColor={theme.colors.placeholder}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
          value={product.description}
          onChangeText={(text) => setProduct({ ...product, description: text })}
          placeholder="Description du produit"
          placeholderTextColor={theme.colors.placeholder}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Prix*</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
          value={product.price.toString()}
          onChangeText={(text) => setProduct({ ...product, price: text })}
          placeholder="Prix"
          placeholderTextColor={theme.colors.placeholder}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Images</Text>
        <View style={styles.imageContainer}>
          {product.images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          {product.images.length < 5 && (
            <TouchableOpacity
              style={[styles.addImage, { backgroundColor: theme.colors.card }]}
              onPress={handleImagePick}
            >
              <Ionicons name="add" size={40} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    margin: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProductScreen;
