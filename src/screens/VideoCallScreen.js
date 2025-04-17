import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const VideoCallScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const { contactName } = route.params || {};

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(prev => !prev);
  };

  const handleCameraToggle = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleVideoToggle = () => {
    setIsVideoEnabled(prev => !prev);
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {isVideoEnabled ? (
        <Camera style={styles.camera} type={type}>
          <View style={styles.header}>
            <Text style={styles.contactName}>{contactName || 'Unknown'}</Text>
            <Text style={styles.callStatus}>
              {formatDuration(callDuration)}
            </Text>
          </View>
        </Camera>
      ) : (
        <View style={styles.noVideoContainer}>
          <View style={styles.header}>
            <Text style={styles.contactName}>{contactName || 'Unknown'}</Text>
            <Text style={styles.callStatus}>
              {formatDuration(callDuration)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleMuteToggle}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color="white"
          />
          <Text style={styles.controlText}>Muet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
          onPress={handleVideoToggle}
        >
          <Ionicons
            name={isVideoEnabled ? 'videocam' : 'videocam-off'}
            size={24}
            color="white"
          />
          <Text style={styles.controlText}>Vidéo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleCameraToggle}
        >
          <Ionicons
            name="camera-reverse"
            size={24}
            color="white"
          />
          <Text style={styles.controlText}>Retourner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
          onPress={handleSpeakerToggle}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-medium'}
            size={24}
            color="white"
          />
          <Text style={styles.controlText}>Haut-parleur</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.endCallButton}
        onPress={handleEndCall}
      >
        <Ionicons name="call" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  camera: {
    flex: 1,
  },
  noVideoContainer: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#333333',
  },
  controlButtonActive: {
    backgroundColor: '#007AFF',
  },
  controlText: {
    color: 'white',
    marginTop: 8,
    fontSize: 12,
  },
  endCallButton: {
    alignSelf: 'center',
    backgroundColor: '#FF3B30',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
    marginVertical: 20,
  },
});

export default VideoCallScreen;
