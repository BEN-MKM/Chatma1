import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const { width } = Dimensions.get('window');
const MAX_WIDTH = width * 0.6;

const MediaMessage = ({ media, type, timestamp, isOwnMessage }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Erreur de chargement');
  };

  const renderMedia = () => {
    switch (type) {
      case 'image':
        return (
          <Image
            source={{ uri: media }}
            style={styles.media}
            onLoad={handleLoad}
            onError={handleError}
          />
        );
      case 'video':
        return (
          <View>
            <Video
              source={{ uri: media }}
              style={styles.media}
              useNativeControls={showFullscreen}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={handleError}
            />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderFullscreenMedia = () => {
    return (
      <Modal
        visible={showFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullscreen(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          {type === 'image' ? (
            <Image
              source={{ uri: media }}
              style={styles.fullscreenMedia}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: media }}
              style={styles.fullscreenMedia}
              useNativeControls
              resizeMode="contain"
              shouldPlay
            />
          )}
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessage]}>
      <TouchableOpacity
        onPress={() => setShowFullscreen(true)}
        style={styles.mediaContainer}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#07C160" />
          </View>
        )}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#ff0000" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          renderMedia()
        )}
      </TouchableOpacity>
      <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
        {timestamp}
      </Text>
      {renderFullscreenMedia()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_WIDTH,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  ownMessage: {
    backgroundColor: '#07C160',
  },
  mediaContainer: {
    width: MAX_WIDTH,
    height: MAX_WIDTH * 0.75,
    backgroundColor: '#eee',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    margin: 5,
  },
  ownTimestamp: {
    color: '#fff',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenMedia: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: '#ff0000',
    marginTop: 5,
  },
});

export default MediaMessage;
