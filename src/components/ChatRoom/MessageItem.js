import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import AudioPlayer from './AudioPlayer';
import ImageViewer from './ImageViewer';
import LocationViewer from './LocationViewer';
import { useTheme } from '../../theme/defaultTheme';

const MessageItem = ({ message, isOwn }) => {
  const theme = useTheme();

  const formattedTime = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
    locale: fr
  });

  const handleDownload = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        window.open(message.content, '_blank');
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour sauvegarder le fichier');
        return;
      }

      const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        // Mettre à jour la progression si nécessaire
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        message.content,
        FileSystem.documentDirectory + message.attachments.name,
        {},
        callback
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      if (message.type === 'image' || message.type === 'video') {
        await MediaLibrary.saveToLibraryAsync(uri);
      } else {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      Alert.alert('Erreur', 'Impossible de télécharger le fichier');
    }
  }, [message]);

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message.content}
          </Text>
        );

      case 'image':
        return (
          <TouchableOpacity onPress={() => handleImagePress(message.content)}>
            <Image
              source={{ uri: message.content }}
              style={styles.imageContent}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );

      case 'audio':
        return (
          <AudioPlayer
            uri={message.content}
            isOwn={isOwn}
          />
        );

      case 'document':
        return (
          <TouchableOpacity
            style={[styles.documentContainer, isOwn && styles.ownDocumentContainer]}
            onPress={handleDownload}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={isOwn ? '#FFF' : theme.colors.primary}
            />
            <View style={styles.documentInfo}>
              <Text
                style={[styles.documentName, isOwn && styles.ownDocumentName]}
                numberOfLines={1}
              >
                {message.attachments.name}
              </Text>
              <Text
                style={[styles.documentSize, isOwn && styles.ownDocumentSize]}
              >
                {formatFileSize(message.attachments.size)}
              </Text>
            </View>
          </TouchableOpacity>
        );

      case 'location':
        return (
          <LocationViewer
            latitude={message.content.latitude}
            longitude={message.content.longitude}
            onPress={() => handleLocationPress(message.content)}
          />
        );

      case 'contact':
        return (
          <TouchableOpacity
            style={[styles.contactContainer, isOwn && styles.ownContactContainer]}
            onPress={() => handleContactPress(message.content)}
          >
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={isOwn ? '#FFF' : theme.colors.primary}
            />
            <View style={styles.contactInfo}>
              <Text
                style={[styles.contactName, isOwn && styles.ownContactName]}
              >
                {message.content.name}
              </Text>
              <Text
                style={[styles.contactNumber, isOwn && styles.ownContactNumber]}
              >
                {message.content.phoneNumbers[0]?.number}
              </Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const handleImagePress = (uri) => {
    // Ouvrir la visionneuse d'images
  };

  const handleLocationPress = async (location) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${location.latitude},${location.longitude}`,
      android: `geo:0,0?q=${location.latitude},${location.longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
    });

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleContactPress = async (contact) => {
    if (Platform.OS === 'web') return;

    const phoneNumber = contact.phoneNumbers[0]?.number;
    if (!phoneNumber) return;

    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={[styles.bubble, isOwn && styles.ownBubble]}>
        {renderContent()}
        <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 8,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  ownMessageText: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  ownDocumentContainer: {
    backgroundColor: 'transparent',
  },
  documentInfo: {
    marginLeft: 8,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  ownDocumentName: {
    color: '#FFF',
  },
  documentSize: {
    fontSize: 12,
    color: '#8E8E93',
  },
  ownDocumentSize: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  ownContactContainer: {
    backgroundColor: 'transparent',
  },
  contactInfo: {
    marginLeft: 8,
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  ownContactName: {
    color: '#FFF',
  },
  contactNumber: {
    fontSize: 12,
    color: '#8E8E93',
  },
  ownContactNumber: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default React.memo(MessageItem);
