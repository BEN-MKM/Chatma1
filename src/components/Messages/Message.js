import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioPlayer = ({ uri, theme }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  }, []);

  const unloadSound = useCallback(async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Erreur lors du déchargement du son:', error);
      }
    }
  }, [sound]);

  const loadSound = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await unloadSound();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis || 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du son:', error);
      setError('Impossible de charger l\'audio');
      setIsLoading(false);
    }
  }, [uri, onPlaybackStatusUpdate, unloadSound]);

  const handlePlayPause = useCallback(async () => {
    try {
      if (error) {
        await loadSound();
        return;
      }

      if (!sound) {
        await loadSound();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        if (position === duration) {
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      setError('Impossible de lire l\'audio');
    }
  }, [sound, isPlaying, position, duration, loadSound, error]);

  useEffect(() => {
    loadSound();
    return () => {
      unloadSound();
    };
  }, [loadSound, unloadSound]);

  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? position / duration : 0;

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity
        onPress={handlePlayPause}
        style={[
          styles.playButton,
          {
            backgroundColor: theme?.colors?.primary || '#007AFF',
            opacity: isLoading ? 0.5 : 1,
          },
        ]}
        disabled={isLoading}
      >
        <Ionicons
          name={isLoading ? 'hourglass-outline' : isPlaying ? 'pause' : 'play'}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View style={styles.audioProgressContainer}>
        <View style={styles.audioProgressBar}>
          <View
            style={[
              styles.audioProgress,
              {
                width: `${progress * 100}%`,
                backgroundColor: theme?.colors?.primary || '#007AFF',
              },
            ]}
          />
        </View>
        <View style={styles.audioTiming}>
          <Text style={[
            styles.audioTime,
            { color: theme?.colors?.textSecondary || '#666666' }
          ]}>
            {formatTime(position)}
          </Text>
          <Text style={[
            styles.audioTime,
            { color: theme?.colors?.textSecondary || '#666666' }
          ]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {error && (
        <TouchableOpacity
          onPress={loadSound}
          style={styles.retryButton}
        >
          <Ionicons
            name="reload"
            size={16}
            color={theme?.colors?.error || '#FF3B30'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Message = ({ message, theme, isUser }) => {
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : theme?.colors?.text || '#000000' }
          ]}>
            {message.content}
          </Text>
        );

      case 'image':
        return (
          <Image
            source={{ uri: message.content }}
            style={styles.image}
            resizeMode="cover"
          />
        );

      case 'audio':
        return (
          <AudioPlayer
            uri={message.content}
            theme={theme}
          />
        );

      case 'location':
        return (
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <Ionicons
                name="location"
                size={24}
                color={theme?.colors?.primary || '#007AFF'}
              />
              <Text style={[
                styles.locationText,
                { color: isUser ? '#FFFFFF' : theme?.colors?.text || '#000000' }
              ]}>
                Position partagée
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                const { latitude, longitude } = message.content;
                const url = Platform.select({
                  ios: `maps:0,0?q=${latitude},${longitude}`,
                  android: `geo:0,0?q=${latitude},${longitude}`,
                });
                Linking.openURL(url);
              }}
              style={[
                styles.openMapButton,
                { backgroundColor: theme?.colors?.primary || '#007AFF' }
              ]}
            >
              <Text style={styles.openMapText}>Ouvrir dans Maps</Text>
            </TouchableOpacity>
          </View>
        );

      case 'document':
        return (
          <TouchableOpacity
            onPress={() => Linking.openURL(message.content)}
            style={styles.documentContainer}
          >
            <Ionicons
              name="document"
              size={24}
              color={theme?.colors?.primary || '#007AFF'}
            />
            <View style={styles.documentInfo}>
              <Text style={[
                styles.documentName,
                { color: theme?.colors?.text || '#000000' }
              ]}>
                {message.fileName}
              </Text>
              <Text style={[
                styles.documentSize,
                { color: theme?.colors?.textSecondary || '#666666' }
              ]}>
                {(message.fileSize / 1024).toFixed(1)} KB
              </Text>
            </View>
          </TouchableOpacity>
        );

      case 'contact':
        return (
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${message.content.phoneNumber}`)}
            style={styles.contactContainer}
          >
            <View style={[
              styles.contactAvatar,
              { backgroundColor: theme?.colors?.primary || '#007AFF' }
            ]}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[
                styles.contactName,
                { color: theme?.colors?.text || '#000000' }
              ]}>
                {message.content.name}
              </Text>
              <Text style={[
                styles.contactPhone,
                { color: theme?.colors?.textSecondary || '#666666' }
              ]}>
                {message.content.phoneNumber}
              </Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.otherContainer,
    ]}>
      <View style={[
        styles.bubble,
        isUser
          ? [styles.userBubble, { backgroundColor: theme?.colors?.primary || '#007AFF' }]
          : [styles.otherBubble, { backgroundColor: theme?.colors?.surface || '#F0F0F0' }],
      ]}>
        {renderContent()}
      </View>
      <Text style={[
        styles.timestamp,
        { color: theme?.colors?.textSecondary || '#666666' }
      ]}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: '100%',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  audioProgressContainer: {
    flex: 1,
  },
  audioProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  audioProgress: {
    height: '100%',
    borderRadius: 2,
  },
  audioTiming: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  audioTime: {
    fontSize: 12,
  },
  retryButton: {
    padding: 8,
  },
  locationContainer: {
    padding: 12,
    minWidth: 200,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
  },
  openMapButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  openMapText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  documentInfo: {
    marginLeft: 8,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: 8,
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
  },
});

export default Message;
