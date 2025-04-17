import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    messageNotifications: true,
    messagePreview: true,
    readReceipts: true,
    typing: true,
    mediaAutoDownload: true,
    archiveChats: false,
    blockNewChats: false,
    saveToGallery: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    Alert.alert(
      "Réinitialiser les paramètres",
      "Voulez-vous vraiment réinitialiser tous les paramètres de chat ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Réinitialiser",
          onPress: () => {
            setSettings({
              messageNotifications: true,
              messagePreview: true,
              readReceipts: true,
              typing: true,
              mediaAutoDownload: true,
              archiveChats: false,
              blockNewChats: false,
              saveToGallery: true
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text>Notifications de messages</Text>
          <Switch
            value={settings.messageNotifications}
            onValueChange={() => toggleSetting('messageNotifications')}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Aperçu des messages</Text>
          <Switch
            value={settings.messagePreview}
            onValueChange={() => toggleSetting('messagePreview')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <View style={styles.settingItem}>
          <Text>Accusés de lecture</Text>
          <Switch
            value={settings.readReceipts}
            onValueChange={() => toggleSetting('readReceipts')}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Indicateur de frappe</Text>
          <Switch
            value={settings.typing}
            onValueChange={() => toggleSetting('typing')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Médias</Text>
        <View style={styles.settingItem}>
          <Text>Téléchargement automatique</Text>
          <Switch
            value={settings.mediaAutoDownload}
            onValueChange={() => toggleSetting('mediaAutoDownload')}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Sauvegarder dans la galerie</Text>
          <Switch
            value={settings.saveToGallery}
            onValueChange={() => toggleSetting('saveToGallery')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avancé</Text>
        <View style={styles.settingItem}>
          <Text>Archiver les chats inactifs</Text>
          <Switch
            value={settings.archiveChats}
            onValueChange={() => toggleSetting('archiveChats')}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Bloquer les nouveaux chats</Text>
          <Switch
            value={settings.blockNewChats}
            onValueChange={() => toggleSetting('blockNewChats')}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Réinitialiser les paramètres</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resetButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatSettingsScreen;
