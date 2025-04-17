import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PinnedMessages = ({ messages = [], onMessagePress, onUnpin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      tension: 40,
      friction: 7
    }).start();
  };

  if (messages.length === 0) return null;

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, Math.min(messages.length * 60, 180)]
  });

  const getMessagePreview = (message) => {
    switch (message.type) {
      case 'text':
        return message.content;
      case 'image':
        return '📷 Photo';
      case 'audio':
        return '🎵 Message vocal';
      default:
        return 'Message';
    }
  };

  return (
    <Animated.View style={[styles.container, { height }]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleExpand}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="pin" size={16} color="#007AFF" />
          <Text style={styles.headerText}>
            {messages.length} message{messages.length > 1 ? 's' : ''} épinglé{messages.length > 1 ? 's' : ''}
          </Text>
        </View>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#8E8E93" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.messageList}>
          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              style={styles.messageItem}
              onPress={() => onMessagePress(message)}
            >
              <View style={styles.messageContent}>
                <Text style={styles.sender}>{message.sender.name}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                  {getMessagePreview(message)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unpinButton}
                onPress={() => onUnpin(message)}
              >
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C7C7CC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C7C7CC',
  },
  messageContent: {
    flex: 1,
  },
  sender: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  preview: {
    fontSize: 14,
    color: '#3A3A3C',
  },
  unpinButton: {
    marginLeft: 10,
    padding: 2,
  },
});

export default React.memo(PinnedMessages);
