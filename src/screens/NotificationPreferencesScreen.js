import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationPreferencesScreen = () => {
  const [settings, setSettings] = useState({
    messages: {
      enabled: true,
      preview: true,
      sound: true,
      vibration: true
    },
    groups: {
      enabled: true,
      mentions: true,
      sound: true
    },
    posts: {
      likes: true,
      comments: true,
      shares: true,
      newFollowers: true
    },
    marketplace: {
      orders: true,
      promotions: true,
      statusUpdates: true
    },
    system: {
      updates: true,
      security: true,
      announcements: true
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

  const renderSection = (title, items, category) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map(({ label, value, setting, icon, description }) => (
        <View key={label} style={styles.settingItem}>
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
          <Switch
            value={value}
            onValueChange={() => handleToggleSetting(category, setting)}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor={Platform.OS === 'android' ? '#f4f3f4' : ''}
          />
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection('Messages', [
        {
          label: 'Notifications de messages',
          value: settings.messages.enabled,
          setting: 'enabled',
          icon: 'chatbubble-outline',
          description: 'Recevoir des notifications pour les nouveaux messages'
        },
        {
          label: 'Aperçu des messages',
          value: settings.messages.preview,
          setting: 'preview',
          icon: 'eye-outline',
          description: 'Afficher le contenu des messages dans les notifications'
        },
        {
          label: 'Son',
          value: settings.messages.sound,
          setting: 'sound',
          icon: 'volume-medium-outline'
        },
        {
          label: 'Vibration',
          value: settings.messages.vibration,
          setting: 'vibration',
          icon: 'phone-portrait-outline'
        }
      ], 'messages')}

      {renderSection('Groupes', [
        {
          label: 'Notifications de groupe',
          value: settings.groups.enabled,
          setting: 'enabled',
          icon: 'people-outline',
          description: 'Recevoir des notifications pour les messages de groupe'
        },
        {
          label: 'Mentions',
          value: settings.groups.mentions,
          setting: 'mentions',
          icon: 'at-outline',
          description: 'Notifications quand vous êtes mentionné'
        },
        {
          label: 'Son',
          value: settings.groups.sound,
          setting: 'sound',
          icon: 'volume-medium-outline'
        }
      ], 'groups')}

      {renderSection('Publications', [
        {
          label: 'J\'aime',
          value: settings.posts.likes,
          setting: 'likes',
          icon: 'heart-outline',
          description: 'Quand quelqu\'un aime vos publications'
        },
        {
          label: 'Commentaires',
          value: settings.posts.comments,
          setting: 'comments',
          icon: 'chatbox-outline',
          description: 'Quand quelqu\'un commente vos publications'
        },
        {
          label: 'Partages',
          value: settings.posts.shares,
          setting: 'shares',
          icon: 'share-outline',
          description: 'Quand quelqu\'un partage vos publications'
        },
        {
          label: 'Nouveaux abonnés',
          value: settings.posts.newFollowers,
          setting: 'newFollowers',
          icon: 'person-add-outline',
          description: 'Quand quelqu\'un commence à vous suivre'
        }
      ], 'posts')}

      {renderSection('Marché', [
        {
          label: 'Commandes',
          value: settings.marketplace.orders,
          setting: 'orders',
          icon: 'cart-outline',
          description: 'Mises à jour de vos commandes'
        },
        {
          label: 'Promotions',
          value: settings.marketplace.promotions,
          setting: 'promotions',
          icon: 'pricetag-outline',
          description: 'Offres spéciales et réductions'
        },
        {
          label: 'Mises à jour de statut',
          value: settings.marketplace.statusUpdates,
          setting: 'statusUpdates',
          icon: 'refresh-outline',
          description: 'Changements de statut de vos commandes'
        }
      ], 'marketplace')}

      {renderSection('Système', [
        {
          label: 'Mises à jour',
          value: settings.system.updates,
          setting: 'updates',
          icon: 'download-outline',
          description: 'Nouvelles versions de l\'application'
        },
        {
          label: 'Sécurité',
          value: settings.system.security,
          setting: 'security',
          icon: 'shield-outline',
          description: 'Alertes de sécurité importantes'
        },
        {
          label: 'Annonces',
          value: settings.system.announcements,
          setting: 'announcements',
          icon: 'megaphone-outline',
          description: 'Nouvelles fonctionnalités et annonces'
        }
      ], 'system')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA'
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
  }
});

export default NotificationPreferencesScreen;
