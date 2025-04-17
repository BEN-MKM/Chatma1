import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AudioRecorder = ({
  isRecording,
  recordingDuration,
  recordingAmplitude,
  showCancelHint,
  showLockHint,
  gestureOffset,
  isLocked,
  onStop,
}) => {
  if (!isRecording) return null;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            { translateX: gestureOffset.x },
            { translateY: -gestureOffset.y }
          ]
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.visualizer}>
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.visualizerBar,
                {
                  height: 3 + Math.random() * recordingAmplitude * 20,
                  backgroundColor: showCancelHint ? '#FF3B30' : '#007AFF',
                  opacity: recordingAmplitude
                }
              ]}
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons 
            name={showCancelHint ? "close-circle" : "mic"} 
            size={24} 
            color={showCancelHint ? "#FF3B30" : "#007AFF"} 
          />
          <Text style={[
            styles.durationText,
            showCancelHint && styles.cancelText,
            showLockHint && styles.lockText
          ]}>
            {showCancelHint ? 'Glissez pour annuler' : 
             showLockHint ? 'Relâchez pour verrouiller' :
             formatDuration(recordingDuration)}
          </Text>
        </View>

        {isLocked && (
          <Ionicons 
            name="send" 
            size={24} 
            color="#007AFF"
            style={styles.sendIcon}
            onPress={onStop}
          />
        )}
      </View>

      {!showCancelHint && !showLockHint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            ← Glissez pour annuler • Glissez vers le haut pour verrouiller ↑
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginRight: 15,
    flex: 1,
  },
  visualizerBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  durationText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    fontWeight: '500',
  },
  cancelText: {
    color: '#FF3B30',
  },
  lockText: {
    color: '#34C759',
  },
  sendIcon: {
    padding: 8,
  },
  hintContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default React.memo(AudioRecorder);
