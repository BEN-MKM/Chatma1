import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';

const ChatSearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'messages', 'media', 'links'

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simuler une recherche d'API
      // À remplacer par votre logique de recherche réelle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = [
        {
          id: '1',
          type: 'message',
          content: 'Voici le lien que vous avez demandé',
          timestamp: '2025-02-24T15:30:00Z',
          sender: {
            id: '1',
            name: 'Alice Martin',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          },
        },
        {
          id: '2',
          type: 'media',
          content: 'https://picsum.photos/200/300',
          mediaType: 'image',
          timestamp: '2025-02-23T10:15:00Z',
          sender: {
            id: '2',
            name: 'Bob Durant',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          },
        },
        {
          id: '3',
          type: 'link',
          content: 'https://example.com',
          preview: 'Exemple de site web',
          timestamp: '2025-02-22T08:45:00Z',
          sender: {
            id: '3',
            name: 'Claire Dubois',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
          },
        },
      ];

      const filteredResults = activeFilter === 'all'
        ? mockResults
        : mockResults.filter(result => result.type === activeFilter);

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  // Utiliser useMemo pour créer une version mémorisée de la fonction debounced
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      performSearch(query);
    }, 300),
    [performSearch]
  );

  // Nettoyer la fonction debounced lors du démontage du composant
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleResultPress = (result) => {
    navigation.navigate('ChatRoom', {
      chatId: result.sender.id,
      title: result.sender.name,
      avatar: result.sender.avatar,
      highlightMessageId: result.id,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
    >
      <Image
        source={{ uri: item.sender.avatar }}
        style={styles.avatar}
      />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.senderName}>{item.sender.name}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>

        {item.type === 'message' && (
          <Text style={styles.messageText} numberOfLines={2}>
            {item.content}
          </Text>
        )}

        {item.type === 'media' && (
          <View style={styles.mediaPreview}>
            <Image
              source={{ uri: item.content }}
              style={styles.mediaThumb}
            />
            <Text style={styles.mediaType}>
              {item.mediaType === 'image' ? 'Photo' : 'Vidéo'}
            </Text>
          </View>
        )}

        {item.type === 'link' && (
          <View style={styles.linkPreview}>
            <Ionicons name="link" size={16} color="#666" />
            <Text style={styles.linkText} numberOfLines={1}>
              {item.preview}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les messages..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'all' && styles.activeFilter]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              Tout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'messages' && styles.activeFilter]}
            onPress={() => setActiveFilter('messages')}
          >
            <Text style={[styles.filterText, activeFilter === 'messages' && styles.activeFilterText]}>
              Messages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'media' && styles.activeFilter]}
            onPress={() => setActiveFilter('media')}
          >
            <Text style={[styles.filterText, activeFilter === 'media' && styles.activeFilterText]}>
              Médias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'links' && styles.activeFilter]}
            onPress={() => setActiveFilter('links')}
          >
            <Text style={[styles.filterText, activeFilter === 'links' && styles.activeFilterText]}>
              Liens
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
        />
      ) : searchQuery.length > 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>
            Aucun résultat trouvé pour "{searchQuery}"
          </Text>
        </View>
      ) : null}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filters: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  resultsList: {
    padding: 8,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaThumb: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  mediaType: {
    fontSize: 14,
    color: '#666',
  },
  linkPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ChatSearchScreen;
