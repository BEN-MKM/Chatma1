import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const MAX_WIDTH = WINDOW_WIDTH * 0.7;
const MAX_HEIGHT = 200;

const MediaMessage = ({ message, isOwnMessage, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveMedia = async () => {
    try {
      setIsLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour sauvegarder le média');
        return;
      }

      const fileUri = message.media.url;
      if (fileUri.startsWith('file://')) {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('ChatMa', asset, false);
        Alert.alert('Succès', 'Le média a été sauvegardé dans votre galerie');
      } else {
        const filename = fileUri.split('/').pop();
        const localUri = `${FileSystem.documentDirectory}${filename}`;
        
        await FileSystem.downloadAsync(fileUri, localUri);
        const asset = await MediaLibrary.createAssetAsync(localUri);
        await MediaLibrary.createAlbumAsync('ChatMa', asset, false);
        await FileSystem.deleteAsync(localUri);
        
        Alert.alert('Succès', 'Le média a été sauvegardé dans votre galerie');
      }
    } catch (error) {
      console.error('Error saving media:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le média');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMedia = () => {
    const { media } = message;
    
    if (!media || !media.url) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={theme?.error || '#FF3B30'} />
          <Text style={[styles.errorText, { color: theme?.error || '#FF3B30' }]}>
            Média non disponible
          </Text>
        </View>
      );
    }

    switch (media.type) {
      case 'image':
        return (
          <View>
            <Image
              source={{ uri: media.url }}
              style={[
                styles.image,
                {
                  width: Math.min(media.width || MAX_WIDTH, MAX_WIDTH),
                  height: Math.min(media.height || MAX_HEIGHT, MAX_HEIGHT),
                }
              ]}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme?.primary || '#007AFF' }]}
              onPress={handleSaveMedia}
              disabled={isLoading}
            >
              <Ionicons
                name={isLoading ? 'cloud-download-outline' : 'download'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        );

      case 'video':
        return (
          <View>
            <Video
              source={{ uri: media.url }}
              style={[
                styles.video,
                {
                  width: Math.min(media.width || MAX_WIDTH, MAX_WIDTH),
                  height: Math.min(media.height || MAX_HEIGHT, MAX_HEIGHT),
                }
              ]}
              useNativeControls
              resizeMode="contain"
              isLooping
              shouldPlay={isPlaying}
              onPlaybackStatusUpdate={status => setIsPlaying(status.isPlaying)}
            />
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme?.primary || '#007AFF' }]}
              onPress={handleSaveMedia}
              disabled={isLoading}
            >
              <Ionicons
                name={isLoading ? 'cloud-download-outline' : 'download'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        );

      case 'document':
        return (
          <View style={[
            styles.documentContainer,
            { backgroundColor: theme?.messageBackground || '#F0F0F0' }
          ]}>
            <Ionicons name="document" size={32} color={theme?.primary || '#007AFF'} />
            <View style={styles.documentInfo}>
              <Text style={[styles.documentName, { color: theme?.text || '#000000' }]}>
                {media.name || 'Document'}
              </Text>
              <Text style={[styles.documentSize, { color: theme?.textSecondary || '#666666' }]}>
                {formatFileSize(media.size)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.documentButton, { backgroundColor: theme?.primary || '#007AFF' }]}
              onPress={handleSaveMedia}
              disabled={isLoading}
            >
              <Ionicons
                name={isLoading ? 'cloud-download-outline' : 'download'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      {renderMedia()}
    </View>
  );
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  image: {
    borderRadius: 12,
  },
  video: {
    borderRadius: 12,
  },
  saveButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 200,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
  },
  documentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default MediaMessage;
