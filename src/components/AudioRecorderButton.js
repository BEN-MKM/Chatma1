import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioRecorderButton = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingInterval = useRef(null);

  const checkPermissions = useCallback(async () => {
    try {
      console.log('Vérification des permissions audio...');
      let permissionResponse;
      
      if (Platform.OS === 'ios') {
        permissionResponse = await Audio.requestPermissionsAsync();
      } else {
        // Pour Android, on utilise la même méthode
        permissionResponse = await Audio.requestPermissionsAsync();
      }

      const { status } = permissionResponse;
      console.log('Statut de la permission:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'L\'application a besoin d\'accéder au microphone pour enregistrer l\'audio.',
          [{ text: 'OK' }]
        );
        setHasPermission(false);
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: false,
      });

      setHasPermission(true);
      console.log('Permissions accordées et mode audio configuré');
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'obtenir les permissions pour le microphone'
      );
      return false;
    }
  }, []);

  const startPulseAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopRecording = useCallback(async () => {
    try {
      console.log('Arrêt de l\'enregistrement...');
      if (!recording) {
        console.log('Pas d\'enregistrement à arrêter');
        return;
      }

      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
      setIsRecording(false);
      pulseAnim.setValue(1);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Enregistrement arrêté, URI:', uri);
      
      setRecording(null);
      setRecordingDuration(0);

      if (uri && onRecordingComplete) {
        onRecordingComplete(uri);
      }

    } catch (error) {
      console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'arrêter l\'enregistrement. Veuillez réessayer.'
      );
      setIsRecording(false);
      setRecording(null);
    }
  }, [recording, onRecordingComplete, pulseAnim]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Démarrage de l\'enregistrement...');
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        console.log('Pas de permission pour enregistrer');
        return;
      }

      console.log('Création d\'un nouvel enregistrement...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          android: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        }
      );

      console.log('Nouvel enregistrement créé');
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      startPulseAnimation();

    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      Alert.alert(
        'Erreur',
        'Impossible de démarrer l\'enregistrement. Vérifiez que le microphone est accessible.'
      );
      setIsRecording(false);
      setRecording(null);
    }
  }, [checkPermissions, startPulseAnimation]);

  const handlePress = useCallback(async () => {
    console.log('Bouton pressé, état actuel:', isRecording ? 'enregistrement' : 'arrêté');
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    checkPermissions();
    return () => {
      console.log('Nettoyage du composant AudioRecorderButton');
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [checkPermissions, recording]);

  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          isRecording && styles.buttonRecording
        ]}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={24}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>
      {isRecording && (
        <Text style={styles.duration}>
          {formatDuration(recordingDuration)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  duration: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default AudioRecorderButton;
