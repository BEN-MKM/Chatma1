import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const CreateContent = ({ navigation }) => {
  const theme = useTheme();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [contentType, setContentType] = useState(null); // 'text', 'photo', 'video', 'reel'
  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState([]);

  const handleMediaPick = async (type) => {
    try {
      const options = {
        mediaTypes: type === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 3],
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);
      
      if (!result.canceled) {
        setSelectedMedia(result.assets[0]);
        setContentType(type);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du média:', error);
    }
  };

  const handleTextChange = (text) => {
    setPostText(text);
    // Extraire les hashtags
    const tags = text.match(/#\w+/g) || [];
    setHashtags(tags);
  };

  const handlePost = () => {
    // Ici, vous pouvez implémenter la logique pour publier le contenu
    const post = {
      text: postText,
      hashtags,
      media: selectedMedia,
      type: contentType,
      timestamp: new Date().toISOString(),
    };
    console.log('Publication à envoyer:', post);
    navigation.goBack();
  };

  const canPost = postText.trim().length > 0 || selectedMedia;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Créer une publication</Text>
          <TouchableOpacity 
            style={[
              styles.postButton, 
              { backgroundColor: canPost ? theme.colors.primary : theme.colors.border }
            ]}
            onPress={handlePost}
            disabled={!canPost}
          >
            <Text style={[styles.postButtonText, { color: canPost ? 'white' : theme.colors.text }]}>
              Publier
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Que voulez-vous partager ?"
              placeholderTextColor={theme.colors.text + '80'}
              multiline
              value={postText}
              onChangeText={handleTextChange}
              autoFocus={!selectedMedia}
            />
          </View>

          {hashtags.length > 0 && (
            <View style={styles.hashtagContainer}>
              {hashtags.map((tag, index) => (
                <View 
                  key={index} 
                  style={[styles.hashtagBadge, { backgroundColor: theme.colors.primary + '20' }]}
                >
                  <Text style={[styles.hashtagText, { color: theme.colors.primary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.option, contentType === 'text' && styles.selectedOption]}
              onPress={() => {
                setContentType('text');
                setSelectedMedia(null);
              }}
            >
              <Ionicons 
                name="text-outline" 
                size={32} 
                color={contentType === 'text' ? theme.colors.primary : theme.colors.text} 
              />
              <Text style={[
                styles.optionText, 
                { color: contentType === 'text' ? theme.colors.primary : theme.colors.text }
              ]}>Texte</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, contentType === 'photo' && styles.selectedOption]}
              onPress={() => handleMediaPick('photo')}
            >
              <Ionicons 
                name="image-outline" 
                size={32} 
                color={contentType === 'photo' ? theme.colors.primary : theme.colors.text} 
              />
              <Text style={[
                styles.optionText, 
                { color: contentType === 'photo' ? theme.colors.primary : theme.colors.text }
              ]}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, contentType === 'video' && styles.selectedOption]}
              onPress={() => handleMediaPick('video')}
            >
              <Ionicons 
                name="videocam-outline" 
                size={32} 
                color={contentType === 'video' ? theme.colors.primary : theme.colors.text} 
              />
              <Text style={[
                styles.optionText, 
                { color: contentType === 'video' ? theme.colors.primary : theme.colors.text }
              ]}>Vidéo</Text>
            </TouchableOpacity>
          </View>

          {selectedMedia && (
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: selectedMedia.uri }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => {
                  setSelectedMedia(null);
                  setContentType(null);
                }}
              >
                <Ionicons name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  textInputContainer: {
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 0,
  },
  hashtagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  option: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectedOption: {
    backgroundColor: '#eee',
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  previewContainer: {
    padding: 16,
    position: 'relative',
  },
  mediaPreview: {
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: 12,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
});

export default CreateContent;
