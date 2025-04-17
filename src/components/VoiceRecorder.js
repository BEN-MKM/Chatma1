import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Vibration,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MAX_RECORDING_TIME = 120; // 2 minutes en secondes

const VoiceRecorder = ({ onFinishRecording, onCancelRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [slideToCancel, setSlideToCancel] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recordingAnimation = useMemo(() => new Animated.Value(0), []);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const cancelThreshold = -80; // Distance pour annuler

  // Simulation des niveaux audio
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random());
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        slideAnimation.setValue(gestureState.dx);
        if (gestureState.dx < cancelThreshold) {
          setSlideToCancel(true);
        } else {
          setSlideToCancel(false);
        }
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      
      if (gestureState.dx < cancelThreshold) {
        stopRecording(true);
      }
    },
  }), [cancelThreshold, slideAnimation, stopRecording]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      Vibration.vibrate(100);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, stopRecording]);

  useEffect(() => {
    let animationLoop;
    if (isRecording) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(recordingAnimation, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true
          })
        ])
      );
      animationLoop.start();
    } else {
      recordingAnimation.setValue(0);
    }
    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [isRecording, recordingAnimation]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSlideToCancel(false);
  };

  const stopRecording = useCallback((cancelled = false) => {
    if (cancelled || slideToCancel) {
      onCancelRecording();
      Vibration.vibrate([0, 50]);
    } else if (recordingTime > 1) { // Minimum 1 seconde d'enregistrement
      onFinishRecording(recordingTime);
      Vibration.vibrate([0, 50, 50, 50]);
    } else {
      onCancelRecording();
      Vibration.vibrate([0, 50]);
    }
    setIsRecording(false);
    setRecordingTime(0);
    setSlideToCancel(false);
  }, [slideToCancel, recordingTime, onCancelRecording, onFinishRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const timeLeft = MAX_RECORDING_TIME - recordingTime;
    if (timeLeft <= 10) return '#FF3B30';
    if (timeLeft <= 30) return '#FF9500';
    return '#000';
  };

  const scale = recordingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const progressWidth = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <View style={styles.container}>
      {isRecording ? (
        <Animated.View 
          style={[
            styles.recordingContainer,
            { transform: [{ translateX: slideAnimation }] }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progressWidth}%` }]} />
          </View>
          
          <View style={styles.recordingContent}>
            <Animated.View style={[styles.audioLevelContainer, { transform: [{ scale }] }]}>
              <View style={[styles.audioLevel, { height: `${audioLevel * 100}%` }]} />
            </Animated.View>
            
            <Text style={[styles.timer, { color: getTimeColor() }]}>
              {formatTime(recordingTime)}
            </Text>
            
            <View style={styles.slideCancelContainer}>
              <Ionicons 
                name="arrow-back" 
                size={20} 
                color={slideToCancel ? '#FF3B30' : '#666'} 
              />
              <Text style={[
                styles.slideText,
                slideToCancel && styles.slideCancelActive
              ]}>
                Glissez pour annuler
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stopButton,
                recordingTime <= 1 && styles.stopButtonDisabled
              ]}
              onPress={() => stopRecording(false)}
            >
              <Ionicons 
                name="checkmark" 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={styles.micButton}
          onPress={startRecording}
          onLongPress={startRecording}
        >
          <Ionicons name="mic" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  micButton: {
    backgroundColor: '#07C160',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  progress: {
    height: '100%',
    backgroundColor: '#07C160',
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  audioLevelContainer: {
    width: 3,
    height: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  audioLevel: {
    width: '100%',
    backgroundColor: '#07C160',
    position: 'absolute',
    bottom: 0,
    borderRadius: 1.5,
  },
  timer: {
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 45,
  },
  slideCancelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slideText: {
    color: '#666',
    marginLeft: 5,
  },
  slideCancelActive: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#07C160',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default VoiceRecorder;
