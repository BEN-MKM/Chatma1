import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const CreateContentScreen = ({ route }) => {
  const { type = 'text' } = route.params || {};
  const navigation = useNavigation();
  const theme = useTheme();
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [location, setLocation] = useState('');

  const handleImagePicker = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setSelectedImages(prev => [...prev, pickerResult.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  }, []);

  const handleMusicPicker = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedMusic({
          uri: result.uri,
          name: result.name,
          size: result.size,
        });
      }
    } catch (error) {
      console.error('Error picking music:', error);
      Alert.alert('Erreur', 'Impossible de charger le fichier audio');
    }
  }, []);

  const handlePublish = useCallback(() => {
    // Ici, vous ajouteriez la logique pour publier le contenu
    Alert.alert('Succès', 'Votre publication a été créée !');
    navigation.goBack();
  }, [navigation]);

  const renderMusicPreview = () => {
    if (!selectedMusic) return null;
    return (
      <View style={styles.musicPreview}>
        <Ionicons name="musical-note" size={24} color={theme.colors.primary} />
        <Text style={[styles.musicName, { color: theme.colors.text }]} numberOfLines={1}>
          {selectedMusic.name}
        </Text>
        <TouchableOpacity 
          style={styles.removeMusic}
          onPress={() => setSelectedMusic(null)}
        >
          <Ionicons name="close-circle" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {type === 'photo' ? 'Nouvelle photo' : 
           type === 'story' ? 'Nouvelle story' : 
           type === 'music' ? 'Nouvelle musique' : 'Nouveau post'}
        </Text>
        <TouchableOpacity 
          style={[
            styles.publishButton, 
            { opacity: text.length > 0 || selectedImages.length > 0 || selectedMusic ? 1 : 0.5 }
          ]}
          disabled={text.length === 0 && selectedImages.length === 0 && !selectedMusic}
          onPress={handlePublish}
        >
          <Text style={styles.publishText}>Publier</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={type === 'music' ? 'Décrivez votre musique...' : 'Que voulez-vous partager ?'}
          placeholderTextColor={theme.colors.text + '80'}
          multiline
          value={text}
          onChangeText={setText}
        />

        {/* Music Preview */}
        {type === 'music' && renderMusicPreview()}

        {/* Media Preview */}
        <View style={styles.mediaPreview}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImage}
                onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        {type !== 'music' && (
          <TouchableOpacity style={styles.toolbarButton} onPress={handleImagePicker}>
            <Ionicons name="images-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        {type === 'music' && (
          <TouchableOpacity style={styles.toolbarButton} onPress={handleMusicPicker}>
            <Ionicons name="musical-notes-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="happy-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'transparent',
  },
  musicPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  musicName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  removeMusic: {
    padding: 5,
  },
  toolbar: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10,
    backgroundColor: '#f8f8f8', 
  },
  toolbarButton: {
    flex: 1, 
    alignItems: 'center', 
    padding: 10, 
  },
});

export default CreateContentScreen;
