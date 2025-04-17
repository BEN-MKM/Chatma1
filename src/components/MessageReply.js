import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageReply = ({ replyTo, onCancelReply }) => {
  if (!replyTo) return null;

  const getPreviewContent = () => {
    switch (replyTo.type) {
      case 'text':
        return replyTo.content;
      case 'image':
        return '📷 Photo';
      case 'audio':
        return '🎵 Message vocal';
      default:
        return 'Message';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="return-up-back" size={16} color="#007AFF" />
          <Text style={styles.replyingTo}>
            Réponse à <Text style={styles.username}>{replyTo.sender.name}</Text>
          </Text>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {getPreviewContent()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onCancelReply}
      >
        <Ionicons name="close-circle" size={20} color="#8E8E93" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
    marginHorizontal: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyingTo: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  username: {
    color: '#007AFF',
    fontWeight: '600',
  },
  preview: {
    fontSize: 14,
    color: '#3A3A3C',
  },
  closeButton: {
    marginLeft: 10,
    padding: 2,
  },
});

export default React.memo(MessageReply);
