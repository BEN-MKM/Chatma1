import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const REACTIONS = [
  { emoji: '👍', name: 'thumbs-up' },
  { emoji: '❤️', name: 'heart' },
  { emoji: '😂', name: 'joy' },
  { emoji: '😮', name: 'wow' },
  { emoji: '😢', name: 'sad' },
  { emoji: '😡', name: 'angry' }
];

const MessageReactions = ({ onReaction, existingReactions = {} }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleReactions = () => {
    const toValue = showReactions ? 0 : 1;
    setShowReactions(!showReactions);
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
  };

  const handleReaction = (reaction) => {
    onReaction(reaction);
    toggleReactions();
  };

  const getReactionCount = (reactionName) => {
    return existingReactions[reactionName] || 0;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleReactions} style={styles.reactionButton}>
        <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
      </TouchableOpacity>

      {showReactions && (
        <Animated.View
          style={[
            styles.reactionsPanel,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }
              ],
              opacity: animation
            }
          ]}
        >
          {REACTIONS.map((reaction) => (
            <TouchableOpacity
              key={reaction.name}
              style={styles.reactionItem}
              onPress={() => handleReaction(reaction.name)}
            >
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              {getReactionCount(reaction.name) > 0 && (
                <Text style={styles.reactionCount}>
                  {getReactionCount(reaction.name)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {Object.entries(existingReactions).length > 0 && (
        <View style={styles.existingReactions}>
          {Object.entries(existingReactions).map(([reaction, count]) => (
            <View key={reaction} style={styles.existingReaction}>
              <Text style={styles.reactionEmoji}>
                {REACTIONS.find(r => r.name === reaction)?.emoji}
              </Text>
              <Text style={styles.reactionCount}>{count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  reactionButton: {
    padding: 5,
  },
  reactionsPanel: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  reactionItem: {
    padding: 5,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 20,
  },
  reactionCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  existingReactions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  existingReaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 3,
    marginRight: 5,
  },
});

export default React.memo(MessageReactions);
