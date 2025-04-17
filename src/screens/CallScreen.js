import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const CallScreen = ({ route, navigation }) => {
  const { contact, isVideo } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Démarrer le timer pour la durée d'appel
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.background || '#000000' }]}>
      {/* Zone supérieure avec les informations du contact */}
      <View style={styles.topContainer}>
        {contact.avatar ? (
          <Image
            source={{ uri: contact.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme?.primary || '#007AFF' }]}>
            <Text style={styles.avatarText}>
              {contact.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.status}>{formatDuration(callDuration)}</Text>
      </View>

      {/* Zone centrale (vide pour appel vocal, vidéo pour appel vidéo) */}
      {isVideo && (
        <View style={styles.videoContainer}>
          {/* Ici, vous pouvez ajouter le composant vidéo */}
          <View style={styles.remoteVideo} />
          <View style={styles.localVideo} />
        </View>
      )}

      {/* Zone inférieure avec les boutons de contrôle */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.controlText}>Muet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          <Ionicons
            name={isSpeaker ? 'volume-high' : 'volume-medium'}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.controlText}>Haut-parleur</Text>
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            <Text style={styles.controlText}>Retourner</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  videoContainer: {
    flex: 1,
    margin: 20,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  controlText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: 12,
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
});

export default CallScreen;
