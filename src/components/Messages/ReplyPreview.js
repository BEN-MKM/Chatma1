import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const ReplyPreview = ({ message, onPress, theme }) => {
  if (!message) return null;

  const renderPreview = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text 
            style={[styles.previewText, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {message.content}
          </Text>
        );
      case 'image':
        return (
          <View style={styles.mediaPreview}>
            <Image
              source={{ uri: message.media.url }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <Text style={[styles.previewText, { color: theme.textSecondary }]}>
              Photo
            </Text>
          </View>
        );
      case 'video':
        return (
          <View style={styles.mediaPreview}>
            <Image
              source={{ uri: message.media.url }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <Text style={[styles.previewText, { color: theme.textSecondary }]}>
              Vidéo
            </Text>
          </View>
        );
      case 'audio':
        return (
          <View style={styles.audioPreview}>
            <Ionicons name="musical-note" size={16} color={theme.textSecondary} />
            <Text style={[styles.previewText, { color: theme.textSecondary }]}>
              Message vocal
            </Text>
          </View>
        );
      case 'document':
        return (
          <View style={styles.documentPreview}>
            <Ionicons name="document" size={16} color={theme.textSecondary} />
            <Text style={[styles.previewText, { color: theme.textSecondary }]}>
              {message.document.name}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: theme.primary }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.primary }]}>
          {message.sender.name}
        </Text>
        {renderPreview()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewText: {
    fontSize: 12,
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ReplyPreview;
