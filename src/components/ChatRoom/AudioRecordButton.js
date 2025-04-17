import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Pressable,
  Vibration,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const AudioRecordButton = ({ onRecordingComplete, theme, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const recording = useRef(null);
  const timer = useRef(null);
  const scale = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // Initialisation d'Audio
  const initializeAudio = useCallback(async () => {
    try {
      console.log('Initialisation du système audio...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      setIsAudioInitialized(true);
      console.log('Système audio initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation audio:', error);
      Alert.alert(
        'Erreur d\'initialisation',
        'Impossible d\'initialiser le système audio. Veuillez redémarrer l\'application.'
      );
    }
  }, []);

  // Initialisation au montage du composant
  useEffect(() => {
    initializeAudio();
    return () => {
      // Nettoyage à la destruction du composant
      if (recording.current) {
        recording.current.stopAndUnloadAsync();
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [initializeAudio]);

  const checkPermissions = useCallback(async () => {
    if (!isAudioInitialized) {
      console.log('Système audio non initialisé, tentative d\'initialisation...');
      await initializeAudio();
    }

    try {
      console.log('Vérification des permissions audio...');
      
      // Vérifier d'abord le statut actuel
      const { status: existingStatus } = await Audio.getPermissionsAsync();
      console.log('Statut actuel des permissions:', existingStatus);
      
      let finalStatus = existingStatus;

      // Si pas encore accordé, demander la permission
      if (existingStatus !== 'granted') {
        console.log('Demande de permissions audio...');
        const { status } = await Audio.requestPermissionsAsync();
        finalStatus = status;
        console.log('Nouveau statut des permissions:', status);
      }

      setHasPermission(finalStatus === 'granted');
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission requise',
          'L\'application a besoin d\'accéder au microphone pour enregistrer l\'audio.',
          [
            { 
              text: 'Annuler',
              style: 'cancel'
            },
            { 
              text: 'Réessayer',
              onPress: () => checkPermissions()
            }
          ]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      setHasPermission(false);
      return false;
    }
  }, [isAudioInitialized, initializeAudio]);

  const startRippleAnimation = useCallback(() => {
    rippleScale.setValue(1);
    rippleOpacity.setValue(1);

    const animation = Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      if (isRecording) {
        startRippleAnimation();
      }
    });
  }, [isRecording, rippleScale, rippleOpacity]);

  const startRecording = useCallback(async () => {
    if (!isAudioInitialized) {
      console.log('Tentative d\'initialisation audio avant l\'enregistrement...');
      await initializeAudio();
    }

    try {
      console.log('Démarrage de l\'enregistrement...');
      const permissionGranted = await checkPermissions();
      if (!permissionGranted) {
        console.log('Permissions non accordées');
        return;
      }

      console.log('Configuration du mode audio...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });

      console.log('Création de l\'enregistrement...');
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        }
      });

      recording.current = newRecording;
      setIsRecording(true);
      setRecordingDuration(0);

      if (timer.current) {
        clearInterval(timer.current);
      }
      
      let startTime = Date.now();
      timer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingDuration(elapsed);
      }, 100);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Animated.spring(scale, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();

      startRippleAnimation();
      console.log('Enregistrement démarré avec succès');

    } catch (error) {
      console.error('Erreur détaillée lors du démarrage de l\'enregistrement:', error);
      
      let errorMessage = 'Impossible de démarrer l\'enregistrement.';
      if (error.message) {
        errorMessage += '\nErreur: ' + error.message;
      }

      Alert.alert(
        'Erreur d\'enregistrement',
        errorMessage
      );
      
      if (recording.current) {
        try {
          await recording.current.stopAndUnloadAsync();
        } catch (e) {
          console.error('Erreur lors du nettoyage:', e);
        }
        recording.current = null;
      }
      
      setIsRecording(false);
      setRecordingDuration(0);
      
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  }, [isAudioInitialized, initializeAudio, checkPermissions, scale, startRippleAnimation, setIsRecording, setRecordingDuration]);

  const handlePressIn = useCallback(() => {
    if (!hasPermission || disabled) {
      return;
    }
    console.log('Début de l\'enregistrement...');
    Vibration.vibrate(50);
    startRecording();
  }, [startRecording, hasPermission, disabled]);

  const stopRecording = useCallback(async () => {
    if (!recording.current) {
      console.log('Pas d\'enregistrement en cours');
      return;
    }

    try {
      console.log('Arrêt de l\'enregistrement...');
      
      // Arrêt du timer et sauvegarde de la durée finale
      const finalDuration = recordingDuration;
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }

      // S'assurer que l'enregistrement est arrêté
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      console.log('URI de l\'enregistrement:', uri);

      // Réinitialisation de l'état
      setIsRecording(false);
      setRecordingDuration(0);

      // Retour haptique et animation
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Vérifier si nous avons un URI valide
      if (!uri) {
        throw new Error('URI de l\'enregistrement non disponible');
      }

      // Envoyer l'enregistrement sans vérification de durée minimale
      console.log('Envoi de l\'enregistrement...');
      onRecordingComplete(uri);

      // Nettoyage
      recording.current = null;

      // Réinitialisation du mode audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

    } catch (error) {
      console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error);
      Alert.alert(
        'Erreur d\'enregistrement',
        'Impossible d\'arrêter l\'enregistrement. ' + (error.message || 'Veuillez réessayer.')
      );
      
      // Réinitialisation en cas d'erreur
      setIsRecording(false);
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      recording.current = null;
    }
  }, [recordingDuration, onRecordingComplete, scale]);

  const handlePressOut = useCallback(() => {
    if (isRecording) {
      console.log('Fin de l\'enregistrement...');
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    checkPermissions();
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
      stopRecording();
    };
  }, [checkPermissions, stopRecording]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: isRecording
              ? theme?.colors?.error || '#FF3B30'
              : theme?.colors?.primary || '#007AFF',
            transform: [{ scale }],
          },
        ]}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={24}
          color="#FFFFFF"
        />
      </Animated.View>

      {isRecording && (
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: theme?.colors?.error || '#FF3B30',
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
      )}

      {isRecording && (
        <Text style={[
          styles.duration,
          { color: theme?.colors?.text || '#000000' }
        ]}>
          {formatDuration(recordingDuration)}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  duration: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AudioRecordButton;
