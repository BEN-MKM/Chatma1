import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

const REACTION_EMOJIS = {
  'thumbsup': '👍',
  'heart': '❤️',
  'joy': '😂',
  'wow': '😮',
  'sad': '😢',
  'angry': '😡',
};

const MessageReactions = ({ reactions, onPress, isOwnMessage, theme }) => {
  if (!reactions || reactions.length === 0) return null;

  // Regrouper les réactions par type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      {Object.entries(reactionCounts).map(([reaction, count]) => (
        <TouchableOpacity
          key={reaction}
          style={[
            styles.reactionBubble,
            { backgroundColor: theme.messageBackground }
          ]}
          onPress={() => onPress(reaction)}
        >
          <Text style={styles.reactionEmoji}>
            {REACTION_EMOJIS[reaction]}
          </Text>
          {count > 1 && (
            <Text style={[styles.reactionCount, { color: theme.text }]}>
              {count}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    bottom: -12,
    zIndex: 1,
  },
  ownMessage: {
    right: 8,
  },
  otherMessage: {
    left: 8,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default MessageReactions;
