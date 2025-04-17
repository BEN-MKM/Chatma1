import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class MessageInteractionService {
  // Réactions aux messages
  static REACTIONS = {
    '👍': 'Like',
    '❤️': 'Love',
    '😂': 'Laugh',
    '😮': 'Surprise',
    '😢': 'Sad'
  };

  // Générer les boutons de réaction
  static renderReactionButtons(onReact) {
    return (
      <View style={styles.reactionContainer}>
        {Object.entries(this.REACTIONS).map(([emoji, label]) => (
          <TouchableOpacity 
            key={emoji}
            onPress={() => onReact(emoji)}
            style={styles.reactionButton}
          >
            <Text style={styles.reactionEmoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Extraction des mentions
  static extractMentions(text) {
    const mentionRegex = /@(\w+)/g;
    return [...text.matchAll(mentionRegex)].map(match => match[1]);
  }

  // Extraction des hashtags
  static extractHashtags(text) {
    const hashtagRegex = /#(\w+)/g;
    return [...text.matchAll(hashtagRegex)].map(match => match[1]);
  }

  // Mettre en surbrillance les mentions et hashtags
  static highlightInteractions(text) {
    return text
      .replace(/@(\w+)/g, '<mention>@$1</mention>')
      .replace(/#(\w+)/g, '<hashtag>#$1</hashtag>');
  }
}

const styles = StyleSheet.create({
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  reactionButton: {
    padding: 5
  },
  reactionEmoji: {
    fontSize: 24
  }
});

export default MessageInteractionService;
