import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Text,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implémenter la logique de recherche ici
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => navigation.navigate('Profile', { userId: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
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
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchScreen;
