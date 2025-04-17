import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const AudioMessage = ({ audioData, isCurrentUser }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [waveformAnimation] = useState(new Animated.Value(0));

  const loadAudio = useCallback(async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioData.uri },
        { shouldPlay: false }
      );

      const status = await newSound.getStatusAsync();
      setSound(newSound);
      setDuration(status.durationMillis || 0);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'audio:', error);
    }
  }, [sound, audioData.uri]);

  useEffect(() => {
    loadAudio();
  }, [loadAudio]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const formatTime = (millis) => {
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startWaveformAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveformAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false
        }),
        Animated.timing(waveformAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false
        })
      ])
    ).start();
  };

  const stopWaveformAnimation = () => {
    waveformAnimation.stopAnimation();
    waveformAnimation.setValue(0);
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        await loadAudio();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
        stopWaveformAnimation();
      } else {
        await sound.playAsync();
        startWaveformAnimation();
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              stopWaveformAnimation();
            }
          }
        });
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
    }
  };

  if (!audioData || !audioData.uri) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <TouchableOpacity 
        style={[
          styles.playButton,
          isCurrentUser ? styles.currentUserPlayButton : styles.otherUserPlayButton
        ]} 
        onPress={handlePlayPause}
      >
        <Ionicons 
          name={isPlaying ? 'pause' : 'play'} 
          size={20} 
          color={isCurrentUser ? '#FFFFFF' : '#007AFF'} 
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.waveform}>
          {Array.from({ length: 27 }).map((_, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: waveformAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      3 + Math.random() * 12,
                      3 + Math.random() * 20
                    ]
                  }),
                  backgroundColor: isCurrentUser 
                    ? position / duration > index / 27 
                      ? '#FFFFFF' 
                      : 'rgba(255, 255, 255, 0.5)'
                    : position / duration > index / 27
                      ? '#007AFF'
                      : 'rgba(0, 122, 255, 0.3)'
                }
              ]}
            />
          ))}
        </View>
        
        <Text style={[
          styles.duration,
          isCurrentUser ? styles.currentUserDuration : styles.otherUserDuration
        ]}>
          {formatTime(isPlaying ? position : duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    maxWidth: '70%',
    minWidth: 150,
  },
  currentUserContainer: {
    backgroundColor: '#007AFF',
  },
  otherUserContainer: {
    backgroundColor: '#F0F0F0',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  currentUserPlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  otherUserPlayButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  infoContainer: {
    flex: 1,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 4,
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  duration: {
    fontSize: 12,
  },
  currentUserDuration: {
    color: '#FFFFFF',
  },
  otherUserDuration: {
    color: '#8E8E93',
  },
});

export default React.memo(AudioMessage);
