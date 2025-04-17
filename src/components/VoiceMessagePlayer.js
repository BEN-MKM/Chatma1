import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VoiceMessagePlayer = ({ duration, isOwnMessage, onSeek }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const progressAnim = useMemo(() => new Animated.Value(0), []);
  const waveformAnimation = useRef(new Animated.Value(0)).current;
  const playbackInterval = useRef(null);

  // Animation des barres de la forme d'onde
  const waveformBars = useMemo(() => 
    [...Array(30)].map(() => ({
      height: Math.random() * 0.8 + 0.2, // Hauteur entre 20% et 100%
      animation: new Animated.Value(0)
    }))
  , []);

  useEffect(() => {
    // Animation continue des barres de la forme d'onde
    if (isPlaying) {
      const animations = waveformBars.map((bar, index) => 
        Animated.sequence([
          Animated.timing(bar.animation, {
            toValue: 1,
            duration: 500 + Math.random() * 500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(bar.animation, {
            toValue: 0,
            duration: 500 + Math.random() * 500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          })
        ])
      );

      Animated.parallel(animations.map(anim => Animated.loop(anim))).start();
    }

    return () => {
      waveformBars.forEach(bar => bar.animation.setValue(0));
    };
  }, [isPlaying, waveformBars]);

  useEffect(() => {
    if (isPlaying) {
      playbackInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: (duration - currentTime) * 1000,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    } else {
      clearInterval(playbackInterval.current);
      progressAnim.stopAnimation();
    }

    return () => {
      clearInterval(playbackInterval.current);
    };
  }, [isPlaying, duration, currentTime, progressAnim]);

  const togglePlay = async () => {
    try {
      if (!isPlaying) {
        setIsLoading(true);
        // Simuler le chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      setError("Erreur de lecture");
      setIsLoading(false);
    }
  };

  const handleSeek = (event) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = event.nativeEvent.layout.width;
    const seekTime = (locationX / progressBarWidth) * duration;
    
    setCurrentTime(Math.min(Math.max(seekTime, 0), duration));
    progressAnim.setValue(seekTime / duration);
    
    if (onSeek) {
      onSeek(seekTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[
      styles.container,
      isOwnMessage && styles.ownMessage,
      error && styles.errorContainer
    ]}>
      <TouchableOpacity 
        onPress={togglePlay} 
        style={[
          styles.playButton,
          isLoading && styles.loadingButton
        ]}
        disabled={isLoading || error}
      >
        {isLoading ? (
          <Animated.View style={styles.loadingIndicator}>
            <Ionicons name="sync" size={24} color={isOwnMessage ? '#fff' : '#07C160'} />
          </Animated.View>
        ) : (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={isOwnMessage ? '#fff' : '#07C160'}
          />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Pressable 
          style={styles.progressContainer}
          onLayout={event => event.nativeEvent.layout}
          onPress={handleSeek}
        >
          <Animated.View
            style={[
              styles.progressBar,
              isOwnMessage ? styles.ownProgressBar : styles.otherProgressBar,
              { width: progressWidth },
            ]}
          />
          <View style={styles.waveform}>
            {waveformBars.map((bar, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveformBar,
                  isOwnMessage ? styles.ownWaveformBar : styles.otherWaveformBar,
                  {
                    height: `${bar.height * 100}%`,
                    transform: [{
                      scaleY: bar.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5]
                      })
                    }]
                  },
                ]}
              />
            ))}
          </View>
        </Pressable>

        {error ? (
          <Text style={[styles.errorText, isOwnMessage && styles.ownErrorText]}>
            {error}
          </Text>
        ) : (
          <View style={styles.timeContainer}>
            <Text style={[styles.duration, isOwnMessage && styles.ownDuration]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={[styles.duration, isOwnMessage && styles.ownDuration]}>
              {formatTime(duration)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ownMessage: {
    backgroundColor: '#07C160',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 12,
  },
  loadingButton: {
    opacity: 0.7,
  },
  loadingIndicator: {
    transform: [{
      rotate: '0deg'
    }],
  },
  contentContainer: {
    flex: 1,
  },
  progressContainer: {
    height: 35,
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 17.5,
  },
  ownProgressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  otherProgressBar: {
    backgroundColor: 'rgba(7, 193, 96, 0.2)',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 2,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
  },
  ownWaveformBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  otherWaveformBar: {
    backgroundColor: 'rgba(7, 193, 96, 0.8)',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  ownDuration: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
  },
  ownErrorText: {
    color: '#fff',
  },
});

export default VoiceMessagePlayer;
