import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { Audio } from 'expo-av';
import ChatHeader from '../components/ChatRoom/ChatHeader';
import MessageList from '../components/ChatRoom/MessageList';
import InputToolbar from '../components/ChatRoom/InputToolbar';
import AttachmentMenu from '../components/ChatRoom/AttachmentMenu';
import { useTheme } from '../theme/defaultTheme';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/ChatService';
import { uploadFile } from '../utils/fileUpload';

const ChatRoomScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { conversationId, participants, type } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const recordingRef = useRef(null);
  const theme = useTheme();

  // Initialisation de la conversation
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await chatService.getConversationMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
        Alert.alert('Erreur', 'Impossible de charger les messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // Souscription aux nouveaux messages
  useEffect(() => {
    const unsubscribe = chatService.subscribeToConversation(conversationId, {
      onNewMessage: (message) => {
        setMessages(prev => [message, ...prev]);
      },
      onMessageUpdate: (message) => {
        setMessages(prev => 
          prev.map(m => m.id === message.id ? message : m)
        );
      },
      onPresenceSync: (presenceState) => {
        // Mise à jour des statuts en ligne si nécessaire
      }
    });

    return () => unsubscribe?.();
  }, [conversationId]);

  // Initialisation de l'audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
      } catch (error) {
        console.error('Erreur initialisation audio:', error);
      }
    };

    initAudio();
  }, []);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    setIsSending(true);
    try {
      await chatService.sendMessage(conversationId, text, 'text');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    } finally {
      setIsSending(false);
    }
  }, [conversationId]);

  const startRecording = useCallback(async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour enregistrer');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur début enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (uri) {
        setIsSending(true);
        const fileUrl = await uploadFile(uri, 'audio/m4a');
        await chatService.sendMessage(conversationId, fileUrl, 'audio');
      }
    } catch (error) {
      console.error('Erreur fin enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de finaliser l\'enregistrement');
    } finally {
      setIsSending(false);
    }
  }, [conversationId]);

  const handlePickImage = useCallback(async (useCamera = false) => {
    try {
      let result;
      
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour utiliser la caméra');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsSending(true);
        try {
          const fileUrl = await uploadFile(result.assets[0].uri, 'image/jpeg');
          await chatService.sendMessage(conversationId, fileUrl, 'image');
        } catch (error) {
          console.error('Erreur envoi image:', error);
          Alert.alert('Erreur', 'Impossible d\'envoyer l\'image');
        } finally {
          setIsSending(false);
        }
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
    setShowAttachMenu(false);
  }, [conversationId]);

  const handlePickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setIsSending(true);
        try {
          const fileUrl = await uploadFile(asset.uri, asset.mimeType);
          await chatService.sendMessage(conversationId, fileUrl, 'document', {
            name: asset.name,
            size: asset.size,
            type: asset.mimeType
          });
        } catch (error) {
          console.error('Erreur envoi document:', error);
          Alert.alert('Erreur', 'Impossible d\'envoyer le document');
        } finally {
          setIsSending(false);
        }
      }
    } catch (error) {
      console.error('Erreur sélection document:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
    }
    setShowAttachMenu(false);
  }, [conversationId]);

  const handleShareLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la localisation');
        return;
      }

      setIsSending(true);
      const location = await Location.getCurrentPositionAsync({});
      await chatService.sendMessage(conversationId, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, 'location');
    } catch (error) {
      console.error('Erreur partage position:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    } finally {
      setIsSending(false);
      setShowAttachMenu(false);
    }
  }, [conversationId]);

  const handleShareContact = useCallback(async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder aux contacts');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        navigation.navigate('ContactPicker', {
          contacts: data,
          onSelect: async (contact) => {
            try {
              setIsSending(true);
              await chatService.sendMessage(conversationId, contact, 'contact');
            } catch (error) {
              console.error('Erreur envoi contact:', error);
              Alert.alert('Erreur', 'Impossible d\'envoyer le contact');
            } finally {
              setIsSending(false);
            }
          }
        });
      }
    } catch (error) {
      console.error('Erreur accès contacts:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder aux contacts');
    }
    setShowAttachMenu(false);
  }, [conversationId, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ChatHeader
        participants={participants}
        type={type}
        onBack={() => navigation.goBack()}
        onInfo={() => navigation.navigate('ConversationInfo', { conversationId, participants, type })}
      />
      
      <MessageList
        messages={messages}
        currentUserId={user.id}
      />

      <InputToolbar
        onSend={handleSendMessage}
        onAttachmentPress={() => setShowAttachMenu(true)}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        isRecording={isRecording}
        isSending={isSending}
      />

      <AttachmentMenu
        visible={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onPickImage={() => handlePickImage(false)}
        onTakePhoto={() => handlePickImage(true)}
        onPickDocument={handlePickDocument}
        onShareLocation={handleShareLocation}
        onShareContact={handleShareContact}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default ChatRoomScreen;
