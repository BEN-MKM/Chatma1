import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageItem = ({ 
  message, 
  onPress, 
  onLongPress, 
  isSelected,
  currentUserId 
}) => {
  const isOwnMessage = message.senderId === currentUserId;

  const renderStatus = () => {
    switch (message.status) {
      case 'sent':
        return <Ionicons name="checkmark" size={16} color="#999" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={16} color="#999" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={16} color="#0084ff" />;
      default:
        return <Ionicons name="time-outline" size={16} color="#999" />;
    }
  };

  return (
    <Pressable
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
        isSelected && styles.selected
      ]}
    >
      {message.deleted ? (
        <Text style={styles.deletedText}>{message.content}</Text>
      ) : (
        <>
          <Text style={styles.messageText}>{message.content}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            {isOwnMessage && renderStatus()}
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 12,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  selected: {
    backgroundColor: '#E8F1FF',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  deletedText: {
    fontSize: 16,
    color: '#999999',
    fontStyle: 'italic',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    marginRight: 4,
  },
});

export default memo(MessageItem, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.isSelected === nextProps.isSelected
  );
});
