import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PinnedMessagesScreen = ({ route, navigation }) => {
  const { conversation } = route.params;
  
  // Simuler des messages épinglés
  const pinnedMessages = [
    {
      id: '1',
      text: 'Message important épinglé',
      sender: { id: 'other', username: 'Jean' },
      timestamp: new Date().getTime() - 3600000,
    },
    // ... autres messages épinglés
  ];

  const handleUnpin = (message) => {
    Alert.alert(
      'Désépingler le message',
      'Voulez-vous désépingler ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Désépingler',
          onPress: () => {
            // Logique pour désépingler
          }
        }
      ]
    );
  };

  const handleMessagePress = (message) => {
    navigation.navigate('ChatRoom', {
      conversation,
      scrollToMessage: message.id,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pinnedMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.messageItem}
            onPress={() => handleMessagePress(item)}
          >
            <View style={styles.messageContent}>
              <Text style={styles.senderName}>{item.sender.username}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.unpinButton}
              onPress={() => handleUnpin(item)}
            >
              <Ionicons name="pin" size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noMessages}>Aucun message épinglé</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  unpinButton: {
    padding: 10,
  },
  noMessages: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default PinnedMessagesScreen;
