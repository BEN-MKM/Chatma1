import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchMessagesScreen = ({ route, navigation }) => {
  const { conversation } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Simuler une recherche
    if (query.trim()) {
      setResults([
        {
          id: '1',
          text: 'Voici un message qui contient votre recherche',
          sender: { id: 'other', username: 'Jean' },
          timestamp: new Date().getTime() - 3600000,
        },
        // ... autres résultats
      ]);
    } else {
      setResults([]);
    }
  };

  const handleMessagePress = (message) => {
    navigation.navigate('ChatRoom', {
      conversation,
      scrollToMessage: message.id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans les messages..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleMessagePress(item)}
          >
            <Text style={styles.senderName}>{item.sender.username}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchQuery ? (
            <Text style={styles.noResults}>Aucun résultat trouvé</Text>
          ) : null
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
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default SearchMessagesScreen;
