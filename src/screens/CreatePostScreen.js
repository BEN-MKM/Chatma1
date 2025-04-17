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
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { supabase } from '../services/supabase';

const CreatePostScreen = ({ navigation }) => {
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
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
      if (selectedImages.length + newImages.length <= 9) {
        setSelectedImages([...selectedImages, ...newImages]);
      } else {
        Alert.alert('Limite atteinte', 'Vous pouvez sélectionner jusqu’à 9 images maximum.');
      }
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!caption.trim() && selectedImages.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter du texte ou des images à votre post.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Upload images to Supabase Storage
      const imageUrls = selectedImages.length > 0 
        ? await Promise.all(selectedImages.map(async (uri) => {
            // Implement image upload logic here
            return uri; // Temporary return the local URI
          }))
        : [];

      // TODO: Create post in Supabase
      const post = {
        user_id: currentUser.id,
        caption,
        images: imageUrls,
        created_at: new Date().toISOString(),
      };

      // Navigate back after successful post
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du post.');
    } finally {
      setLoading(false);
    }
  };

  const renderImageGrid = () => (
    <View style={styles.imageGrid}>
      {selectedImages.map((uri, index) => (
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
      {selectedImages.length < 9 && (
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <Ionicons name="add" size={40} color="#8E8E93" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={loading}
          style={[
            styles.postButton,
            (!caption.trim() && selectedImages.length === 0) && styles.disabledButton
          ]}
        >
          <Text style={[
            styles.postButtonText,
            (!caption.trim() && selectedImages.length === 0) && styles.disabledButtonText
          ]}>
            {loading ? 'Publication...' : 'Publier'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.inputContainer}>
          <Image
            source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Que voulez-vous partager ?"
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={2200}
          />
        </View>
        {renderImageGrid()}
      </ScrollView>
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
  postButton: {
    backgroundColor: '#2BAE66',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  disabledButtonText: {
    color: '#8E8E93',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 200,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  imageContainer: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addImageButton: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 8,
    margin: 5,
  },
});

export default CreatePostScreen;
