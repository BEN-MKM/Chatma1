import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Données de test pour les contacts
const mockContacts = [
  {
    id: '1',
    name: 'Alice Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'En ligne',
    region: 'Shanghai',
  },
  {
    id: '2',
    name: 'Bob Wang',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Hors ligne',
    region: 'Beijing',
  },
  {
    id: '3',
    name: 'Carol Liu',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'En ligne',
    region: 'Guangzhou',
  },
];

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const ContactsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(mockContacts);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsLoading(true);
    
    // Simuler un délai de recherche
    setTimeout(() => {
      if (!text.trim()) {
        setContacts(mockContacts);
      } else {
        const filtered = mockContacts.filter(contact =>
          contact.name.toLowerCase().includes(text.toLowerCase())
        );
        setContacts(filtered);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleContactPress = (contact) => {
    if (!contact?.id) return;

    navigation.navigate('ChatRoom', {
      title: contact.name,
      isOnline: contact.status === 'En ligne',
      region: contact.region,
      avatar: contact.avatar
    });
  };

  const handleCallPress = (contact, type) => {
    navigation.navigate(type === 'audio' ? 'VoiceCall' : 'VideoCall', {
      contact: contact
    });
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.avatar || DEFAULT_AVATAR }} 
          style={styles.avatar}
        />
        {item.status === 'En ligne' && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>
          {item.status} • {item.region}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCallPress(item, 'audio')}
        >
          <Ionicons name="call-outline" size={22} color="#07C160" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCallPress(item, 'video')}
        >
          <Ionicons name="videocam-outline" size={22} color="#07C160" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un contact..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#07C160" style={styles.loader} />
        )}
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun contact trouvé</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Ionicons name="person-add" size={24} color="#FFF" />
      </TouchableOpacity>
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  loader: {
    marginLeft: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#07C160',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  contactStatus: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#07C160',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ContactsScreen;
