import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditPostScreen = ({ route, navigation }) => {
  const [post, setPost] = useState(route.params?.post || {
    id: '1',
    image: 'https://picsum.photos/500/500',
    caption: 'Belle photo #photo',
    location: 'Paris, France',
    allowComments: true,
    hideStats: false,
  });

  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location);
  const [allowComments, setAllowComments] = useState(post.allowComments);
  const [hideStats, setHideStats] = useState(post.hideStats);
  const [tags, setTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSave = useCallback(async () => {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le post
      const updatedPost = {
        ...post,
        caption,
        location,
        allowComments,
        hideStats,
        tags,
      };
      
      // Navigation de retour avec le post mis à jour
      navigation.navigate('PostDetail', { post: updatedPost });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications');
    }
  }, [post, caption, location, allowComments, hideStats, tags, navigation]);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Supprimer le post',
      'Êtes-vous sûr de vouloir supprimer ce post ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // Simuler la suppression
            navigation.navigate('Feed');
          },
        },
      ]
    );
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Image du post */}
      <Image source={{ uri: post.image }} style={styles.image} />

      {/* Section édition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Légende</Text>
        <TextInput
          style={styles.input}
          multiline
          value={caption}
          onChangeText={setCaption}
          placeholder="Ajouter une légende..."
        />
      </View>

      {/* Localisation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localisation</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location-outline" size={24} color="#666" />
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Ajouter un lieu"
          />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={styles.tag}
              onPress={() => handleRemoveTag(tag)}
            >
              <Text style={styles.tagText}>#{tag}</Text>
              <Ionicons name="close-circle" size={16} color="#666" />
            </TouchableOpacity>
          ))}
          {showTagInput ? (
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Ajouter un tag"
                onSubmitEditing={handleAddTag}
                autoFocus
              />
              <TouchableOpacity onPress={() => setShowTagInput(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => setShowTagInput(true)}
            >
              <Ionicons name="add" size={24} color="#0095F6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Paramètres avancés */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres avancés</Text>
        <View style={styles.settingItem}>
          <Text>Autoriser les commentaires</Text>
          <Switch
            value={allowComments}
            onValueChange={setAllowComments}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={allowComments ? '#0095F6' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Masquer les statistiques</Text>
          <Switch
            value={hideStats}
            onValueChange={setHideStats}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={hideStats ? '#0095F6' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  section: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    minHeight: 40,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  tagText: {
    marginRight: 5,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tagInput: {
    flex: 1,
    marginRight: 10,
  },
  addTagButton: {
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0095F6',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditPostScreen;
