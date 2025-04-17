import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import CallService from '../services/CallService';

const { width, height } = Dimensions.get('window');

const CallScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(route.params?.callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, ongoing, ended
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const timerRef = useRef(null);
  const { contactName, contactAvatar, callType, userId } = route.params || {};

  const endCall = useCallback(async () => {
    try {
      await CallService.endCall();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCallStatus('ended');
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la fin de l'appel:", error);
    }
  }, [navigation]);

  const handleCallEvent = useCallback((event, data) => {
    switch (event) {
      case 'incoming-call':
        // Gérer l'appel entrant
        break;
      case 'call-ended':
        endCall();
        break;
      case 'remote-stream':
        setRemoteStream(data.stream);
        break;
    }
  }, [endCall]);

  const requestPermissions = useCallback(async () => {
    const { status: cameraStatus } = await Camera.requestPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    
    if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
      Alert.alert(
        "Permissions requises",
        "L'application nécessite l'accès à la caméra et au microphone pour les appels.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      return false;
    }
    
    setHasPermission(true);
    return true;
  }, [navigation]);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        await requestPermissions();
        
        // Initialiser le service d'appel
        await CallService.initialize("YOUR_SOCKET_URL", handleCallEvent);
        
        // Démarrer l'appel
        const stream = await CallService.startCall(userId, isVideoEnabled);
        setLocalStream(stream);
        setCallStatus('ongoing');
        startTimer();
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'appel:", error);
        Alert.alert(
          "Erreur",
          "Impossible d'établir l'appel. Veuillez réessayer.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    };

    initializeCall();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      CallService.endCall();
    };
  }, [navigation, userId, isVideoEnabled, handleCallEvent, requestPermissions]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = async () => {
    try {
      await CallService.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Erreur lors de la mise en sourdine:", error);
    }
  };

  const toggleSpeaker = async () => {
    try {
      await CallService.toggleSpeaker(!isSpeakerOn);
      setIsSpeakerOn(!isSpeakerOn);
    } catch (error) {
      console.error("Erreur lors du changement de haut-parleur:", error);
    }
  };

  const toggleVideo = async () => {
    try {
      await CallService.toggleVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    } catch (error) {
      console.error("Erreur lors du basculement vidéo:", error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Permissions de caméra et microphone requises
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isVideoEnabled ? (
        <View style={styles.videoContainer}>
          {localStream && (
            <Camera style={styles.localVideo} type={Camera.Constants.Type.front} />
          )}
          {remoteStream && (
            <View style={styles.remoteVideo}>
              {/* Afficher le flux vidéo distant ici */}
            </View>
          )}
          <View style={styles.callInfo}>
            <Text style={styles.name}>{contactName}</Text>
            <Text style={styles.status}>
              {callStatus === 'connecting' ? 'Appel en cours...' : formatDuration(callDuration)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.audioCallContainer}>
          <Image
            source={{ uri: contactAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{contactName}</Text>
          <Text style={styles.status}>
            {callStatus === 'connecting' ? 'Appel en cours...' : formatDuration(callDuration)}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity
            style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
            onPress={toggleVideo}
          >
            <Ionicons
              name={isVideoEnabled ? 'videocam' : 'videocam-off'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-low'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  localVideo: {
    flex: 1,
  },
  remoteVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  callInfo: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#ffffff80',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#2a2a2a',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#007AFF',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CallScreen;
