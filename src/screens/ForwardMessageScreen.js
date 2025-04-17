import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForwardMessageScreen = ({ route, navigation }) => {
  const { messages, sourceChat } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChats, setSelectedChats] = useState([]);

  // Simuler une liste de chats
  const chats = [
    {
      id: '1',
      name: 'Jean Dupont',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Marie Martin',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    // ... autres chats
  ];

  const handleSelectChat = (chat) => {
    setSelectedChats(prev => {
      const isSelected = prev.some(c => c.id === chat.id);
      if (isSelected) {
        return prev.filter(c => c.id !== chat.id);
      } else {
        return [...prev, chat];
      }
    });
  };

  const handleForward = () => {
    // Logique pour transférer les messages
    selectedChats.forEach(chat => {
      navigation.navigate('ChatRoom', {
        conversation: chat,
        forwardedMessages: messages,
      });
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedChats.some(c => c.id === item.id);
          return (
            <TouchableOpacity
              style={[styles.chatItem, isSelected && styles.selectedChat]}
              onPress={() => handleSelectChat(item)}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.chatName}>{item.name}</Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#2b5278" />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {selectedChats.length > 0 && (
        <TouchableOpacity
          style={styles.forwardButton}
          onPress={handleForward}
        >
          <Text style={styles.forwardText}>
            Transférer vers {selectedChats.length} chat{selectedChats.length > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedChat: {
    backgroundColor: '#f0f7ff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatName: {
    fontSize: 16,
    flex: 1,
  },
  forwardButton: {
    backgroundColor: '#2b5278',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  forwardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForwardMessageScreen;
