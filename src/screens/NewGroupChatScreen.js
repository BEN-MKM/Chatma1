import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewGroupChatScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contacts data
  const contacts = [
    {
      id: '1',
      name: 'Alice Chen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      selected: false,
    },
    {
      id: '2',
      name: 'Bob Wang',
      avatar: 'https://i.pravatar.cc/150?img=2',
      selected: false,
    },
    {
      id: '3',
      name: 'Carol Liu',
      avatar: 'https://i.pravatar.cc/150?img=3',
      selected: false,
    },
  ];

  const toggleContactSelection = (contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const createGroup = () => {
    if (groupName.trim() && selectedContacts.length >= 2) {
      navigation.navigate('GroupChat', {
        groupName: groupName,
        participants: selectedContacts,
        isNewGroup: true,
      });
    }
  };

  const renderContact = ({ item }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => toggleContactSelection(item)}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.contactName}>{item.name}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#07C160" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Nom du groupe"
          value={groupName}
          onChangeText={setGroupName}
        />
        <Text style={styles.selectedCount}>
          {selectedContacts.length} sélectionnés
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des contacts"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={contacts.filter(contact =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderContact}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        style={[
          styles.createButton,
          (!groupName.trim() || selectedContacts.length < 2) && styles.disabledButton
        ]}
        onPress={createGroup}
        disabled={!groupName.trim() || selectedContacts.length < 2}
      >
        <Text style={styles.createButtonText}>Créer le groupe</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupNameInput: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCount: {
    color: '#666',
    fontSize: 14,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedContact: {
    backgroundColor: '#e8f5e9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#07C160',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewGroupChatScreen;
