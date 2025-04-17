import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  TextInput, FlatList, Image, Modal, Platform, ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModernChatService from '../services/ModernChatService';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import ChatButton from '../components/ChatButton';

const ModernChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [contact, setContact] = useState(null);
  const [theme, setTheme] = useState(ModernChatService.generateTheme());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const flatListRef = useRef(null);
  const inputAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configuration initiale
    if (route.params?.contact) {
      setContact(route.params.contact);
    }
  }, [route.params]);

  // Envoi de message avec analyse de sentiment
  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      const sentiment = ModernChatService.analyzeSentiment(inputText);
      const encryptedMessage = await ModernChatService.encryptMessage(inputText);

      const newMessage = {
        id: Date.now().toString(),
        content: inputText,
        sender: { id: 'currentUser', name: 'Vous' },
        timestamp: new Date().toISOString(),
        sentiment: sentiment,
        encrypted: encryptedMessage,
        status: 'sending'
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Simulation d'envoi de message
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mise à jour du statut du message
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // Simulation de réponse IA
      const aiResponse = ModernChatService.generateAIResponse(inputText);
      const aiMessage = {
        id: Date.now().toString() + '_ai',
        content: aiResponse,
        sender: { id: 'ai', name: 'Assistant' },
        timestamp: new Date().toISOString(),
        status: 'received'
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setInputText('');
      
      // Effet haptique et animation
      ModernChatService.triggerHapticFeedback('light');
      Animated.spring(inputAnimation, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      }).start(() => {
        inputAnimation.setValue(0);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Mettre à jour le statut du message en cas d'erreur
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === newMessage?.id
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    }
  };

  // Sélection de média
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.cancelled) {
      setSelectedMedia(result);
      setModalVisible(true);
    }
  };

  // Partage de localisation
  const shareLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    let location = await Location.getCurrentPositionAsync({});
    const locationMessage = {
      id: Date.now().toString(),
      type: 'location',
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      sender: { id: 'currentUser', name: 'Vous' }
    };

    setMessages(prevMessages => [...prevMessages, locationMessage]);
  };

  // Rendu des messages
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender.id === 'currentUser';
    const isAI = item.sender.id === 'ai';

    return (
      <Animated.View 
        style={[
          styles.messageContainer,
          {
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            backgroundColor: isCurrentUser 
              ? theme.primary 
              : isAI 
                ? theme.secondary 
                : '#FFFFFF'
          }
        ]}
      >
        {item.type === 'location' ? (
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color={theme.accent} 
          />
        ) : (
          <Text 
            style={[
              styles.messageText, 
              { 
                color: isCurrentUser || isAI ? '#FFFFFF' : '#000000',
                fontStyle: isAI ? 'italic' : 'normal'
              }
            ]}
          >
            {item.content}
          </Text>
        )}
        
        {item.sentiment && (
          <View style={styles.sentimentIndicator}>
            <Text style={styles.sentimentText}>
              {item.sentiment.type}
            </Text>
          </View>
        )}
        {item.status && (
          <View style={styles.messageStatus}>
            {item.status === 'sending' && (
              <ActivityIndicator size="small" color="#999" />
            )}
            {item.status === 'sent' && (
              <Ionicons name="checkmark-done" size={16} color="#4CAF50" />
            )}
            {item.status === 'error' && (
              <Ionicons name="alert-circle" size={16} color="#F44336" />
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  // En-tête personnalisé
  const renderHeader = () => (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      style={styles.headerContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.contactInfo}>
        <Image 
          source={{ uri: contact?.avatar || 'default_avatar_url' }} 
          style={styles.contactAvatar} 
        />
        <View>
          <Text style={styles.contactName}>{contact?.name}</Text>
          <Text style={styles.contactStatus}>
            {contact?.isOnline ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('VoiceCallScreen', { 
            contact: contact,
            callType: 'voice' 
          })}
        >
          <Ionicons name="call" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('VideoCallScreen', { 
            contact: contact,
            callType: 'video' 
          })}
        >
          <Ionicons name="videocam" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // Barre de saisie avec design moderne
  const renderInputBar = () => (
    <Animated.View 
      style={[
        styles.inputContainer,
        { 
          transform: [{
            scale: inputAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05]
            })
          }]
        }
      ]}
    >
      <BlurView intensity={50} style={styles.blurContainer}>
        <ChatButton
          icon="image"
          tooltipText="Envoyer une image"
          onPress={pickMedia}
          style={styles.mediaButton}
        />
        
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message..."
          placeholderTextColor={theme.text}
          style={[styles.textInput, { color: theme.text }]}
          multiline
        />
        
        <ChatButton
          icon="location"
          tooltipText="Partager la localisation"
          onPress={shareLocation}
          style={styles.locationButton}
        />
        
        <ChatButton
          icon="send"
          tooltipText="Envoyer le message"
          onPress={sendMessage}
          disabled={!inputText.trim()}
          style={styles.sendButton}
        />
      </BlurView>
    </Animated.View>
  );

  // Modal de prévisualisation de média
  const renderMediaModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Image 
          source={{ uri: selectedMedia?.uri }} 
          style={styles.modalImage} 
        />
        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => {
              // Logique d'envoi de média
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalButtonText}>Envoyer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messageList}
      />
      
      {renderInputBar()}
      {renderMediaModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 30
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  contactName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18
  },
  contactStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15
  },
  messageList: {
    paddingHorizontal: 15
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  messageText: {
    fontSize: 16
  },
  sentimentIndicator: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 3
  },
  sentimentText: {
    fontSize: 10,
    color: '#FFFFFF'
  },
  messageStatus: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: 'transparent'
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    padding: 10
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 100
  },
  mediaButton: {
    backgroundColor: '#9C27B0',
  },
  locationButton: {
    backgroundColor: '#2196F3',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain'
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20
  },
  modalButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});

export default ModernChatScreen;
