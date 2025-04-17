import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatar } from '../assets';

const ContactsList = ({ selectedContacts = [], onContactSelect }) => {
  const contacts = [
    {
      id: '1',
      name: 'John Doe',
      avatar: null,
      phone: '+1234567890',
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: null,
      phone: '+0987654321',
    },
    // Ajoutez plus de contacts ici
  ];

  const renderContactItem = ({ item }) => {
    const isSelected = selectedContacts.find(contact => contact.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedItem]}
        onPress={() => onContactSelect(item)}
      >
        <Image
          source={
            item.avatar
              ? { uri: item.avatar }
              : defaultAvatar
          }
          style={styles.avatar}
        />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={contacts}
      renderItem={renderContactItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ContactsList;
