import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class ChatInteractionService {
  // Réactions enrichies avec animations
  static REACTIONS = {
    '👍': { name: 'Like', color: '#4CAF50' },
    '❤️': { name: 'Love', color: '#FF5252' },
    '😂': { name: 'Laugh', color: '#FFC107' },
    '😮': { name: 'Surprise', color: '#2196F3' },
    '😢': { name: 'Sad', color: '#9C27B0' }
  };

  // Générateur de menu de réactions animé
  static renderReactionMenu(onReact, animationValue) {
    return (
      <Animated.View 
        style={[
          styles.reactionContainer, 
          { 
            transform: [{ 
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              }) 
            }],
            opacity: animationValue
          }
        ]}
      >
        {Object.entries(this.REACTIONS).map(([emoji, details]) => (
          <TouchableOpacity 
            key={emoji}
            onPress={() => onReact(emoji)}
            style={styles.reactionButton}
          >
            <Text style={[styles.reactionEmoji, { color: details.color }]}>
              {emoji}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  }

  // Extraction intelligente des liens et mentions avec gestion des erreurs
  static extractMetadata(text) {
    // Vérification que text est une chaîne de caractères valide
    if (!text || typeof text !== 'string') {
      return {
        links: [],
        mentions: [],
        hashtags: []
      };
    }

    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex = /@(\w+)/g;
    const hashtagRegex = /#(\w+)/g;

    try {
      return {
        links: Array.from(text.match(linkRegex) || []),
        mentions: Array.from(text.match(mentionRegex) || []).map(m => m.slice(1)),
        hashtags: Array.from(text.match(hashtagRegex) || []).map(h => h.slice(1))
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return {
        links: [],
        mentions: [],
        hashtags: []
      };
    }
  }

  // Suggestions de réponses basées sur le contexte
  static generateSmartReplies(message) {
    const contextualReplies = {
      default: [
        '👍 Ok',
        '🤔 Intéressant',
        '👀 Je comprends',
        '❓ Peux-tu m\'en dire plus ?'
      ],
      question: [
        'Oui',
        'Non',
        'Peut-être',
        'Je ne suis pas sûr'
      ],
      greeting: [
        'Salut !',
        'Bonjour !',
        'Comment vas-tu ?',
        'Ça va merci !'
      ]
    };

    // Vérification du type de message
    if (!message || typeof message !== 'string') {
      return contextualReplies.default;
    }

    // Logique simple de classification
    const isQuestion = message.includes('?');
    const isGreeting = ['bonjour', 'salut', 'hey'].some(word => 
      message.toLowerCase().includes(word)
    );

    if (isQuestion) return contextualReplies.question;
    if (isGreeting) return contextualReplies.greeting;
    return contextualReplies.default;
  }

  // Partage contextuel
  static prepareShareContent(message, type = 'text') {
    return {
      type,
      content: message || '',
      timestamp: new Date().toISOString()
    };
  }
}

const styles = StyleSheet.create({
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reactionButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  reactionEmoji: {
    fontSize: 24,
  },
});

export default ChatInteractionService;
