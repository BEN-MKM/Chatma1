import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProductManagementScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [groupBuyEnabled, setGroupBuyEnabled] = useState(false);
  const [groupBuyDiscount, setGroupBuyDiscount] = useState('20');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à l\'appareil photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSave = () => {
    if (!productName || !price || !description || !category || images.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires et ajouter au moins une image.');
      return;
    }

    // TODO: Envoyer les données au backend
    Alert.alert('Succès', 'Produit enregistré avec succès!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Section Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos du produit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF4D4F" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <View style={styles.addImageButtons}>
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <Ionicons name="images" size={24} color="#666" />
                <Text style={styles.addButtonText}>Galerie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="#666" />
                <Text style={styles.addButtonText}>Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Informations produit */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations produit</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du produit"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Prix"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Catégorie"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      {/* Options de vente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Options de vente</Text>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setGroupBuyEnabled(!groupBuyEnabled)}
        >
          <View style={styles.optionLeft}>
            <Ionicons
              name={groupBuyEnabled ? "checkbox" : "square-outline"}
              size={24}
              color={groupBuyEnabled ? "#FF4D4F" : "#666"}
            />
            <Text style={styles.optionText}>Activer l'achat groupé</Text>
          </View>
          {groupBuyEnabled && (
            <TextInput
              style={styles.discountInput}
              placeholder="Réduction %"
              value={groupBuyDiscount}
              onChangeText={setGroupBuyDiscount}
              keyboardType="numeric"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, styles.saveButtonText]}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageWrapper: {
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
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  addButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  discountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#FF4D4F',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default ProductManagementScreen;
