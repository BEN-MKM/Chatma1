import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioMessage from './AudioMessage';

const Message = ({ item, isCurrentUserMessage, onLongPress }) => {
  if (!item) {
    return null; 
  }

  if (!item.timestamp) {
    return null; 
  }

  const messageTime = new Date(item.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const renderContent = () => {
    switch (item.type) {
      case 'text':
        return <Text style={[
          styles.messageText,
          isCurrentUserMessage ? styles.sentMessageText : styles.receivedMessageText
        ]}>{item.content}</Text>;

      case 'image':
        return (
          <Image 
            source={{ uri: item.content.uri }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        );

      case 'audio':
        return (
          <AudioMessage
            audioData={item.content}
            isCurrentUser={isCurrentUserMessage}
          />
        );

      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Ionicons name="document" size={24} color={isCurrentUserMessage ? "#fff" : "#007AFF"} />
            <View style={styles.fileInfo}>
              <Text style={[
                styles.fileName,
                isCurrentUserMessage ? styles.sentMessageText : styles.receivedMessageText
              ]} numberOfLines={1}>
                {item.content.name}
              </Text>
              <Text style={[
                styles.fileSize,
                isCurrentUserMessage ? styles.sentMessageText : styles.receivedMessageText
              ]}>
                {(item.content.size / 1024).toFixed(1)} KB
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(item)}
      delayLongPress={200}
      activeOpacity={0.7}
    >
      <View style={[
        styles.messageContainer,
        isCurrentUserMessage ? styles.sentMessage : styles.receivedMessage,
        item.isPinned && styles.pinnedMessage
      ]}>
        {!isCurrentUserMessage && item.sender && (
          <Text style={styles.senderName}>{item.sender.name}</Text>
        )}

        {item.replyTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>
              {item.replyTo.sender && item.replyTo.sender.name}: {item.replyTo.content}
            </Text>
          </View>
        )}

        {item.isPinned && (
          <View style={styles.pinnedIndicator}>
            <Ionicons name="pin" size={16} color="#007AFF" />
          </View>
        )}

        {renderContent()}

        <Text style={[
          styles.messageTime,
          isCurrentUserMessage ? styles.sentMessageTime : styles.receivedMessageTime
        ]}>
          {messageTime}
        </Text>

        {item.reactions && Object.keys(item.reactions).length > 0 && (
          <View style={styles.reactionsContainer}>
            {Object.entries(item.reactions).map(([emoji, count]) => (
              <View key={emoji} style={styles.reactionBubble}>
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                <Text style={styles.reactionCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    marginLeft: '20%',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    marginRight: '20%',
    borderBottomLeftRadius: 4,
  },
  pinnedMessage: {
    borderWidth: 1,
    borderColor: '#007AFF20',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#000000',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedMessageTime: {
    color: '#8E8E93',
  },
  replyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 13,
    color: '#666666',
  },
  pinnedIndicator: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  fileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    opacity: 0.7,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default React.memo(Message);
