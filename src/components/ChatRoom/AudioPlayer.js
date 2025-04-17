import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const AudioPlayer = ({ uri, isOwn }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  // Gérer les mises à jour de lecture
  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) return;
    
    setPosition(status.positionMillis || 0);
    setIsPlaying(status.isPlaying);
    
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPosition(0);
      sound?.setPositionAsync(0);
    }
  }, [sound]);

  // Charger le son
  const loadSound = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(audioSound);
      const status = await audioSound.getStatusAsync();
      setDuration(status.durationMillis || 0);
    } catch (error) {
      console.error('Erreur chargement audio:', error);
      setError('Impossible de charger l\'audio');
    } finally {
      setIsLoading(false);
    }
  }, [uri, onPlaybackStatusUpdate]);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [loadSound, sound]);

  // Lecture/Pause
  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        if (position === duration) {
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Erreur lecture/pause:', error);
      setError('Impossible de lire l\'audio');
    }
  };

  // Changement de position
  const onSeek = async (value) => {
    if (!sound) return;
    try {
      await sound.setPositionAsync(value);
    } catch (error) {
      console.error('Erreur seek:', error);
    }
  };

  // Formater le temps en MM:SS
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <View style={[styles.container, isOwn && styles.ownContainer]}>
        <Text style={[styles.errorText, isOwn && styles.ownErrorText]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      {isLoading ? (
        <ActivityIndicator color={isOwn ? '#FFF' : '#007AFF'} />
      ) : (
        <>
          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={isOwn ? '#FFF' : '#007AFF'}
            />
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={onSeek}
              minimumTrackTintColor={isOwn ? '#FFF' : '#007AFF'}
              maximumTrackTintColor={isOwn ? 'rgba(255,255,255,0.3)' : '#E5E5EA'}
              thumbTintColor={isOwn ? '#FFF' : '#007AFF'}
            />
            <View style={styles.timeContainer}>
              <Text style={[styles.timeText, isOwn && styles.ownTimeText]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.timeText, isOwn && styles.ownTimeText]}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minWidth: 200,
  },
  ownContainer: {
    backgroundColor: 'transparent',
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 8,
  },
  slider: {
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  ownTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  ownErrorText: {
    color: '#FFB3B3',
  },
});

export default React.memo(AudioPlayer);
