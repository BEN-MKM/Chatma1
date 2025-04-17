import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const WINDOW_WIDTH = Dimensions.get('window').width;

const REACTIONS = [
  { emoji: '👍', name: 'thumbsup', label: "J'aime" },
  { emoji: '❤️', name: 'heart', label: "J'adore" },
  { emoji: '😂', name: 'joy', label: 'MDR' },
  { emoji: '😮', name: 'wow', label: 'Wow' },
  { emoji: '😢', name: 'sad', label: 'Triste' },
  { emoji: '😡', name: 'angry', label: 'Grrr' },
];

const MessageActions = ({
  isVisible,
  onClose,
  onReactionSelect,
  onReply,
  onForward,
  onEdit,
  onDelete,
  onCopy,
  onSave,
  onReport,
  isOwnMessage,
  message,
  theme,
  position = 'bottom',
}) => {
  if (!isVisible) return null;

  const isMediaMessage = message?.type === 'image' || message?.type === 'video' || message?.type === 'audio';

  const renderReactions = () => (
    <View style={styles.reactionsContainer}>
      {REACTIONS.map((reaction) => (
        <TouchableOpacity
          key={reaction.name}
          style={styles.reactionButton}
          onPress={() => {
            onReactionSelect(reaction.name);
            onClose();
          }}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
          <Text style={[styles.reactionLabel, { color: theme.textSecondary }]}>
            {reaction.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          onReply();
          onClose();
        }}
      >
        <Ionicons name="arrow-undo" size={20} color={theme.text} />
        <Text style={[styles.actionText, { color: theme.text }]}>Répondre</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          onForward();
          onClose();
        }}
      >
        <Ionicons name="arrow-redo" size={20} color={theme.text} />
        <Text style={[styles.actionText, { color: theme.text }]}>Transférer</Text>
      </TouchableOpacity>

      {!isMediaMessage && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onCopy();
            onClose();
          }}
        >
          <Ionicons name="copy" size={20} color={theme.text} />
          <Text style={[styles.actionText, { color: theme.text }]}>Copier</Text>
        </TouchableOpacity>
      )}

      {isMediaMessage && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onSave();
            onClose();
          }}
        >
          <Ionicons name="download" size={20} color={theme.text} />
          <Text style={[styles.actionText, { color: theme.text }]}>Enregistrer</Text>
        </TouchableOpacity>
      )}

      {isOwnMessage && (
        <>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onEdit();
              onClose();
            }}
          >
            <Ionicons name="pencil" size={20} color={theme.text} />
            <Text style={[styles.actionText, { color: theme.text }]}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Ionicons name="trash" size={20} color={theme.error} />
            <Text style={[styles.actionText, { color: theme.error }]}>Supprimer</Text>
          </TouchableOpacity>
        </>
      )}

      {!isOwnMessage && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onReport();
            onClose();
          }}
        >
          <Ionicons name="flag" size={20} color={theme.error} />
          <Text style={[styles.actionText, { color: theme.error }]}>Signaler</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <BlurView
        intensity={30}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <Animated.View 
        style={[
          styles.container,
          position === 'top' ? styles.topPosition : styles.bottomPosition,
          { backgroundColor: theme.messageBackground }
        ]}
      >
        {renderReactions()}
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        {renderActions()}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    borderRadius: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: WINDOW_WIDTH - 40,
    alignSelf: 'center',
  },
  topPosition: {
    top: 100,
  },
  bottomPosition: {
    bottom: 100,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  reactionButton: {
    alignItems: 'center',
    padding: 8,
  },
  reactionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  reactionLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  actionsContainer: {
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MessageActions;
