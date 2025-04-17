import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const VoiceCallScreen = ({ navigation, route }) => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { contactName } = route.params || {};

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: !isSpeakerOn,
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    })();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
    };
  }, [isSpeakerOn]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };

  const handleSpeakerToggle = async () => {
    try {
      await Audio.setAudioModeAsync({
        playThroughEarpieceAndroid: isSpeakerOn,
      });
      setIsSpeakerOn(prev => !prev);
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.contactName}>{contactName || 'Unknown'}</Text>
        <Text style={styles.callStatus}>
          {isCallActive ? formatDuration(callDuration) : 'Call Ended'}
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {contactName ? contactName.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      </View>

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
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: Platform.OS === 'android' ? 40 : 0,
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
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
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

export default VoiceCallScreen;
