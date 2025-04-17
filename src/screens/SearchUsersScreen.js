import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchUsersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Mock users data
  const mockUsers = useMemo(() => [
    {
      id: '1',
      username: 'alice_chen',
      name: 'Alice Chen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Photographe amateur 📸',
    },
    {
      id: '2',
      username: 'bob_wang',
      name: 'Bob Wang',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Passionné de cuisine 🍳',
    },
    {
      id: '3',
      username: 'carol_liu',
      name: 'Carol Liu',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Designer UI/UX ✨',
    },
  ], []);

  useEffect(() => {
    setFilteredUsers(mockUsers);
  }, [mockUsers]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simuler une recherche
      const timeoutId = setTimeout(() => {
        const filtered = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery, filteredUsers]);

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des utilisateurs"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#07C160" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            searchQuery.trim() ? (
              <Text style={styles.noResults}>Aucun utilisateur trouvé</Text>
            ) : null
          )}
        />
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
    margin: 15,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default SearchUsersScreen;
