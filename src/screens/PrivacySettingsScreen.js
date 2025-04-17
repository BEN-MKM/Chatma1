import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacySettingsScreen = () => {
  const [settings, setSettings] = useState({
    profile: {
      showStatus: true,
      showLastSeen: true,
      showProfilePhoto: 'everyone',
      showBirthday: 'contacts'
    },
    messaging: {
      readReceipts: true,
      typing: true,
      allowAddToGroups: 'contacts'
    },
    content: {
      showStories: 'everyone',
      showPosts: 'everyone',
      allowComments: true,
      allowSharing: true
    },
    blocking: {
      blockedUsers: []
    }
  });

  const handleToggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleVisibilityChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleBlockedUsers = () => {
    navigation.navigate('BlockedUsers');
  };

  const renderVisibilitySelector = (category, setting, currentValue) => {
    const options = [
      { value: 'everyone', label: 'Tout le monde' },
      { value: 'contacts', label: 'Contacts uniquement' },
      { value: 'nobody', label: 'Personne' }
    ];

    return (
      <View style={styles.visibilitySelector}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.visibilityOption,
              currentValue === option.value && styles.visibilityOptionSelected
            ]}
            onPress={() => handleVisibilityChange(category, setting, option.value)}
          >
            <Text style={[
              styles.visibilityOptionText,
              currentValue === option.value && styles.visibilityOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map(({ label, value, onPress, type = 'switch', icon, description, category, setting }) => (
        <View key={label} style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.settingLeft}>
              {icon && (
                <Ionicons 
                  name={icon} 
                  size={24} 
                  color="#333" 
                  style={styles.settingIcon}
                />
              )}
              <View>
                <Text style={styles.settingLabel}>{label}</Text>
                {description && (
                  <Text style={styles.settingDescription}>{description}</Text>
                )}
              </View>
            </View>
            {type === 'switch' ? (
              <Switch
                value={value}
                onValueChange={onPress}
                trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                thumbColor={Platform.OS === 'android' ? '#f4f3f4' : ''}
              />
            ) : null}
          </View>
          {type === 'visibility' && (
            renderVisibilitySelector(category, setting, value)
          )}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection('Profil', [
        {
          label: 'Statut en ligne',
          value: settings.profile.showStatus,
          onPress: () => handleToggleSetting('profile', 'showStatus'),
          icon: 'radio-button-on-outline',
          description: 'Montrer quand vous êtes en ligne'
        },
        {
          label: 'Dernière connexion',
          value: settings.profile.showLastSeen,
          onPress: () => handleToggleSetting('profile', 'showLastSeen'),
          icon: 'time-outline',
          description: 'Montrer votre dernière connexion'
        },
        {
          label: 'Photo de profil',
          value: settings.profile.showProfilePhoto,
          type: 'visibility',
          icon: 'person-circle-outline',
          category: 'profile',
          setting: 'showProfilePhoto',
          description: 'Qui peut voir votre photo de profil'
        },
        {
          label: 'Date de naissance',
          value: settings.profile.showBirthday,
          type: 'visibility',
          icon: 'calendar-outline',
          category: 'profile',
          setting: 'showBirthday',
          description: 'Qui peut voir votre date de naissance'
        }
      ])}

      {renderSection('Messagerie', [
        {
          label: 'Confirmations de lecture',
          value: settings.messaging.readReceipts,
          onPress: () => handleToggleSetting('messaging', 'readReceipts'),
          icon: 'checkmark-done-outline',
          description: 'Montrer quand vous avez lu les messages'
        },
        {
          label: 'Indicateur de saisie',
          value: settings.messaging.typing,
          onPress: () => handleToggleSetting('messaging', 'typing'),
          icon: 'chatbubble-ellipses-outline',
          description: 'Montrer quand vous écrivez'
        },
        {
          label: 'Ajout aux groupes',
          value: settings.messaging.allowAddToGroups,
          type: 'visibility',
          icon: 'people-outline',
          category: 'messaging',
          setting: 'allowAddToGroups',
          description: 'Qui peut vous ajouter à des groupes'
        }
      ])}

      {renderSection('Contenu', [
        {
          label: 'Stories',
          value: settings.content.showStories,
          type: 'visibility',
          icon: 'film-outline',
          category: 'content',
          setting: 'showStories',
          description: 'Qui peut voir vos stories'
        },
        {
          label: 'Publications',
          value: settings.content.showPosts,
          type: 'visibility',
          icon: 'images-outline',
          category: 'content',
          setting: 'showPosts',
          description: 'Qui peut voir vos publications'
        },
        {
          label: 'Commentaires',
          value: settings.content.allowComments,
          onPress: () => handleToggleSetting('content', 'allowComments'),
          icon: 'chatbox-outline',
          description: 'Autoriser les commentaires sur vos publications'
        },
        {
          label: 'Partage',
          value: settings.content.allowSharing,
          onPress: () => handleToggleSetting('content', 'allowSharing'),
          icon: 'share-outline',
          description: 'Autoriser le partage de vos publications'
        }
      ])}

      {renderSection('Blocage', [
        {
          label: 'Utilisateurs bloqués',
          value: `${settings.blocking.blockedUsers.length} utilisateurs`,
          onPress: handleBlockedUsers,
          type: 'button',
          icon: 'ban-outline',
          description: 'Gérer la liste des utilisateurs bloqués'
        }
      ])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 16
  },
  settingItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA'
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  settingIcon: {
    marginRight: 12
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000'
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2
  },
  visibilitySelector: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 4
  },
  visibilityOption: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  visibilityOptionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  visibilityOptionText: {
    fontSize: 13,
    color: '#8E8E93'
  },
  visibilityOptionTextSelected: {
    color: '#000000',
    fontWeight: '600'
  }
});

export default PrivacySettingsScreen;
