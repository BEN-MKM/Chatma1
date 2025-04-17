import React, { useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { ringtone } from '../assets';

const IncomingCallModal = ({
  visible,
  caller,
  callType,
  onAccept,
  onDecline,
}) => {
  const [ringtoneSound, setRingtone] = React.useState(null);

  const stopRingtone = useCallback(async () => {
    if (ringtoneSound) {
      await ringtoneSound.stopAsync();
      await ringtoneSound.unloadAsync();
      setRingtone(null);
    }
  }, [ringtoneSound]);

  const playRingtone = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(ringtone, { shouldPlay: true, isLooping: true });
      setRingtone(sound);
    } catch (error) {
      console.error("Erreur lors de la lecture de la sonnerie:", error);
    }
  }, []);

  const startVibration = useCallback(() => {
    if (Platform.OS !== 'web') {
      const pattern = [0, 1000, 500, 1000];
      Vibration.vibrate(pattern, true);
    }
  }, []);

  const stopVibration = useCallback(() => {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
  }, []);

  const handleAccept = useCallback(async () => {
    await stopRingtone();
    stopVibration();
    onAccept();
  }, [stopRingtone, stopVibration, onAccept]);

  const handleDecline = useCallback(async () => {
    await stopRingtone();
    stopVibration();
    onDecline();
  }, [stopRingtone, stopVibration, onDecline]);

  useEffect(() => {
    if (visible) {
      playRingtone();
      startVibration();
    } else {
      stopRingtone();
      stopVibration();
    }

    return () => {
      stopRingtone();
      stopVibration();
    };
  }, [visible, playRingtone, startVibration, stopRingtone, stopVibration]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDecline}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={{ uri: caller?.avatar }}
            style={styles.avatar}
          />
          
          <Text style={styles.name}>{caller?.name}</Text>
          
          <Text style={styles.callType}>
            {callType === 'video' ? 'Appel vidéo' : 'Appel vocal'} entrant...
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={handleDecline}
            >
              <Ionicons name="close" size={30} color="white" />
              <Text style={styles.actionText}>Refuser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Ionicons
                name={callType === 'video' ? 'videocam' : 'call'}
                size={30}
                color="white"
              />
              <Text style={styles.actionText}>Accepter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  callType: {
    fontSize: 16,
    color: '#ffffff80',
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    width: 120,
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
  },
});

export default IncomingCallModal;
