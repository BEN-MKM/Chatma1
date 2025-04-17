import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Données de test pour le groupe
const mockGroupMembers = [
  {
    id: '1',
    name: 'Alice Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Bob Wang',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Carol Liu',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const mockMessages = [
  {
    id: '1',
    userId: '1',
    text: 'Bonjour tout le monde ! 👋',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'text',
  },
  {
    id: '2',
    userId: '2',
    text: 'Salut Alice !',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    type: 'text',
  },
  {
    id: '3',
    userId: '3',
    text: 'On se retrouve où ?',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    type: 'text',
  },
];

const GroupChatScreen = ({ navigation, route }) => {
  const { groupId, groupName } = route.params;
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: groupName,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('GroupInfo', { groupId, members: mockGroupMembers })}
        >
          <Ionicons name="people" size={24} color="#07C160" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupName, groupId]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        userId: '1', // ID de l'utilisateur actuel
        text: inputMessage,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      flatListRef.current?.scrollToEnd();
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implémenter l'enregistrement vocal ici
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === '1'; // Vérifier si c'est notre message
    const sender = mockGroupMembers.find(member => member.id === item.userId);

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <Image source={{ uri: sender?.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[
          styles.messageContent,
          isOwnMessage ? styles.ownMessageContent : styles.otherMessageContent
        ]}>
          {!isOwnMessage && (
            <Text style={styles.messageSender}>{sender?.name}</Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Ionicons name="happy-outline" size={24} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Message"
          multiline
        />

        {inputMessage.length > 0 ? (
          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Ionicons name="send" size={24} color="#07C160" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleVoiceRecord}
          >
            <Ionicons
              name={isRecording ? "radio-button-on" : "mic-outline"}
              size={24}
              color={isRecording ? "#FF3B30" : "#666"}
            />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerButton: {
    marginRight: 15,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
  },
  ownMessageContent: {
    backgroundColor: '#07C160',
    borderBottomRightRadius: 5,
  },
  otherMessageContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  button: {
    padding: 8,
  },
});

export default GroupChatScreen;
