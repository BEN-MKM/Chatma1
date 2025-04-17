import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatar } from '../assets';

const ChatHeader = ({ 
  contact = {
    name: 'Contact',
    avatar: null,
    online: false
  },
  onBack = () => {},
  onAudioCall = () => {},
  onVideoCall = () => {},
  onInfo = () => {}
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileContainer} onPress={onInfo}>
        <Image
          source={contact.avatar ? { uri: contact.avatar } : defaultAvatar}
          style={styles.avatar}
          defaultSource={defaultAvatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.status}>
            {contact.online ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onAudioCall} style={styles.actionButton}>
          <Ionicons name="call" size={22} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onVideoCall} style={styles.actionButton}>
          <Ionicons name="videocam" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  infoContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
});

export default React.memo(ChatHeader);
