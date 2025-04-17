import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTheme } from '../../theme/defaultTheme';
import ImageViewer from '../Messages/ImageViewer';

const AudioPlayer = ({ url, isOwnMessage }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  // Configuration initiale de l'audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };
    setupAudio();
  }, []);

  // Chargement du son
  useEffect(() => {
    let isMounted = true;
    let currentSound = null;

    const loadSound = async () => {
      try {
        setIsLoading(true);
        const { sound: audioSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false },
          status => {
            if (!isMounted) return;
            
            if (status.isLoaded) {
              setPosition(status.positionMillis / 1000);
              setDuration(status.durationMillis / 1000);
              if (status.didJustFinish) {
                setIsPlaying(false);
                audioSound.setPositionAsync(0);
              }
            }
          },
          true
        );

        if (!isMounted) {
          await audioSound.unloadAsync();
          return;
        }

        currentSound = audioSound;
        setSound(audioSound);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading sound:', error);
        setIsLoading(false);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [url]);

  const handlePlayPause = async () => {
    try {
      if (!sound) return;

      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
      setIsPlaying(false);
    }
  };

  const handleSeek = async (event) => {
    try {
      if (!sound || !duration) return;

      const { locationX, layoutMeasurement } = event.nativeEvent;
      const percentage = locationX / layoutMeasurement.width;
      const newPosition = percentage * duration;

      await sound.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleChangeSpeed = async () => {
    try {
      if (!sound) return;

      const speeds = [1.0, 1.5, 2.0];
      const currentIndex = speeds.indexOf(playbackRate);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

      await sound.setRateAsync(nextSpeed, true);
      setPlaybackRate(nextSpeed);
    } catch (error) {
      console.error('Error changing speed:', error);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity
        onPress={handlePlayPause}
        disabled={isLoading}
        style={[
          styles.playButton,
          { backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
        ]}
      >
        <Ionicons
          name={isLoading ? 'hourglass' : isPlaying ? 'pause' : 'play'}
          size={24}
          color={isOwnMessage ? '#fff' : theme.text}
        />
      </TouchableOpacity>

      <View style={styles.audioProgressContainer}>
        <Pressable
          onPress={handleSeek}
          style={styles.progressBar}
        >
          <View
            style={[
              styles.progress,
              {
                width: `${progress}%`,
                backgroundColor: isOwnMessage ? '#fff' : theme.primary
              }
            ]}
          />
        </Pressable>

        <View style={styles.timeContainer}>
          <Text style={[
            styles.timeText,
            { color: isOwnMessage ? '#fff' : theme.text }
          ]}>
            {formatTime(position)}
          </Text>
          <Text style={[
            styles.timeText,
            { color: isOwnMessage ? '#fff' : theme.text }
          ]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleChangeSpeed}
        style={styles.speedButton}
      >
        <Text style={[
          styles.speedText,
          { color: isOwnMessage ? '#fff' : theme.text }
        ]}>
          {playbackRate}x
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Message = ({ message, onLongPress, onReactionPress, isOwnMessage }) => {
  const theme = useTheme();
  const [showImageViewer, setShowImageViewer] = useState(false);
  
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#fff' : theme.text }
          ]}>
            {message.content}
          </Text>
        );
      case 'image':
        return (
          <>
            <TouchableOpacity onPress={() => setShowImageViewer(true)}>
              <Image
                source={{ uri: message.url }}
                style={styles.imageContent}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <ImageViewer
              uri={message.url}
              visible={showImageViewer}
              onClose={() => setShowImageViewer(false)}
            />
          </>
        );
      case 'document':
        return (
          <TouchableOpacity 
            style={styles.documentContainer}
            onPress={() => message.url && Linking.openURL(message.url)}
          >
            <Ionicons name="document" size={24} color={isOwnMessage ? '#fff' : theme.text} />
            <Text 
              style={[
                styles.documentName,
                { color: isOwnMessage ? '#fff' : theme.text }
              ]}
              numberOfLines={1}
            >
              {message.fileName || 'Document'}
            </Text>
          </TouchableOpacity>
        );
      case 'audio':
        return (
          <AudioPlayer url={message.url} isOwnMessage={isOwnMessage} />
        );
      case 'location':
        return (
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => {
              const { latitude, longitude } = message.location;
              const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              Linking.openURL(url);
            }}
          >
            <Ionicons name="location" size={24} color={isOwnMessage ? '#fff' : theme.text} />
            <Text 
              style={[
                styles.locationText,
                { color: isOwnMessage ? '#fff' : theme.text }
              ]}
            >
              Voir la localisation
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}
      onLongPress={onLongPress}
      delayLongPress={200}
    >
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
      ]}>
        {renderContent()}
        <Text style={[
          styles.timestamp,
          { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }
        ]}>
          {messageTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageContainer: {
    borderRadius: 16,
    padding: 8,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
  },
  otherMessageBubble: {
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    minWidth: 200,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  audioProgressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
  },
  speedButton: {
    marginLeft: 8,
    padding: 4,
  },
  speedText: {
    fontSize: 12,
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default Message;
