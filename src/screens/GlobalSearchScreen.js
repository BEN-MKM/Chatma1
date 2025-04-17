import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import searchService from '../services/searchService';

const GlobalSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    users: [],
    products: [],
    messages: [],
  });
  const [activeTab, setActiveTab] = useState('all');

  const debouncedSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults({ users: [], products: [], messages: [] });
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchService.searchGlobal(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setLoading(false);
      }
    },
    [] // Suppression de searchService car c'est une valeur externe
  );

  const performSearch = useCallback(
    (searchQuery) => {
      debounce(() => debouncedSearch(searchQuery), 500)();
    },
    [debouncedSearch]
  );

  const handleQueryChange = (text) => {
    setQuery(text);
    performSearch(text);
  };

  const renderUserItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'online' ? '#4CAF50' : '#999' }]} />
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const renderProductItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price} €</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const renderMessageItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigation.navigate('ChatRoom', { roomId: item.room_id })}
    >
      <Image source={{ uri: item.sender.avatar_url }} style={styles.messageAvatar} />
      <View style={styles.messageInfo}>
        <Text style={styles.messageSender}>{item.sender.username}</Text>
        <Text style={styles.messageContent} numberOfLines={2}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const getFilteredResults = useCallback(() => {
    switch (activeTab) {
      case 'users':
        return results.users;
      case 'products':
        return results.products;
      case 'messages':
        return results.messages;
      default:
        return [
          ...results.users.map(item => ({ ...item, type: 'user' })),
          ...results.products.map(item => ({ ...item, type: 'product' })),
          ...results.messages.map(item => ({ ...item, type: 'message' })),
        ];
    }
  }, [activeTab, results]);

  const renderItem = useCallback(({ item }) => {
    if (activeTab === 'all') {
      switch (item.type) {
        case 'user':
          return renderUserItem({ item });
        case 'product':
          return renderProductItem({ item });
        case 'message':
          return renderMessageItem({ item });
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 'users':
        return renderUserItem({ item });
      case 'products':
        return renderProductItem({ item });
      case 'messages':
        return renderMessageItem({ item });
      default:
        return null;
    }
  }, [activeTab, renderUserItem, renderProductItem, renderMessageItem]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Rechercher..."
            value={query}
            onChangeText={handleQueryChange}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setResults({ users: [], products: [], messages: [] });
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Utilisateurs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Produits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0095F6" />
      ) : query.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color="#999" />
          <Text style={styles.emptyStateText}>
            Recherchez des utilisateurs, produits ou messages
          </Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredResults()}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type || activeTab}-${item.id}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun résultat trouvé</Text>
            </View>
          }
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
  header: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0095F6',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#0095F6',
    fontWeight: 'bold',
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
    paddingHorizontal: 30,
  },
  emptyStateText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  list: {
    paddingVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  productInfo: {
    marginLeft: 10,
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageInfo: {
    marginLeft: 10,
    flex: 1,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageContent: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default GlobalSearchScreen;
