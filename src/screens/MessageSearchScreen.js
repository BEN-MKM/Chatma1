import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MessageSearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    date: null,
    type: 'all', // 'all', 'text', 'media', 'links'
    sender: null,
  });

  const handleSearch = useCallback(() => {
    // Simuler une recherche
    const results = [
      {
        id: '1',
        content: 'Message trouvé 1',
        sender: 'User 1',
        timestamp: new Date(),
        type: 'text',
      },
      // Ajouter plus de résultats simulés
    ];
    setSearchResults(results);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('ChatRoom', { messageId: item.id })}
    >
      <View style={styles.resultContent}>
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messagePreview}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* Ouvrir le sélecteur de date */}}
        >
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <Text style={styles.filterText}>Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* Ouvrir le sélecteur de type */}}
        >
          <Ionicons name="filter" size={20} color="#007AFF" />
          <Text style={styles.filterText}>Type</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* Ouvrir le sélecteur d'expéditeur */}}
        >
          <Ionicons name="person" size={20} color="#007AFF" />
          <Text style={styles.filterText}>De</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.resultsList}
        contentContainerStyle={styles.resultsContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  filterText: {
    marginLeft: 5,
    color: '#007AFF',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: 10,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messagePreview: {
    color: '#666',
    marginBottom: 5,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
});

export default MessageSearchScreen;
