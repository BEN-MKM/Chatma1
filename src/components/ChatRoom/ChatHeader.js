import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';

const ChatHeader = ({
  participants,
  type,
  onBack,
  onInfo,
  onCall,
  onVideoCall,
}) => {
  const { theme } = useTheme();
  const mainParticipant = participants[0];
  const otherParticipantsCount = participants.length - 1;

  const renderBackground = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
        />
      );
    }
    return (
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { backgroundColor: theme.colors.background }
        ]} 
      />
    );
  };

  const renderAvatar = () => {
    if (mainParticipant?.avatar_url) {
      return (
        <Image
          source={{ uri: mainParticipant.avatar_url }}
          style={styles.avatar}
        />
      );
    }

    return (
      <View 
        style={[
          styles.avatar, 
          styles.defaultAvatar,
          { backgroundColor: theme.colors.border }
        ]}
      >
        <Text style={[styles.avatarText, { color: theme.colors.text }]}>
          {type === 'group' 
            ? mainParticipant?.username?.charAt(0).toUpperCase() || 'G'
            : mainParticipant?.username?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      {renderBackground()}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={onInfo}
          activeOpacity={0.7}
        >
          {renderAvatar()}
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, { color: theme.colors.text }]} 
              numberOfLines={1}
            >
              {type === 'group'
                ? mainParticipant?.name || 'Groupe'
                : mainParticipant?.username || 'Utilisateur'}
            </Text>
            {type === 'group' && otherParticipantsCount > 0 && (
              <Text 
                style={[styles.subtitle, { color: theme.colors.placeholder }]} 
                numberOfLines={1}
              >
                {`${otherParticipantsCount + 1} participants`}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          {onCall && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onCall}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}

          {onVideoCall && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onVideoCall}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="videocam-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onInfo}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 88 : 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatHeader;
