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

const SecuritySettingsScreen = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    pinCode: false,
    autoLock: false,
    loginAlerts: true,
    messageEncryption: true
  });

  const toggleSetting = (setting) => {
    if (setting === 'biometricAuth') {
      Alert.alert(
        "Authentification biométrique",
        "Cette fonctionnalité n'est pas disponible sur le web. Veuillez utiliser l'application mobile pour y accéder.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };

  const renderSettingItem = (title, description, setting, icon) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => toggleSetting(setting)}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingTexts}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={settings[setting] ? '#007AFF' : '#f4f3f4'}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUTHENTIFICATION</Text>
        {renderSettingItem(
          'Authentification à deux facteurs',
          'Ajouter une couche de sécurité supplémentaire',
          'twoFactorAuth',
          'shield-checkmark-outline'
        )}
        {renderSettingItem(
          'Authentification biométrique',
          Platform.OS === 'web' ? 'Non disponible sur le web' : 'Utiliser Face ID ou Touch ID',
          'biometricAuth',
          'finger-print-outline'
        )}
        {renderSettingItem(
          'Code PIN',
          'Protéger votre compte avec un code PIN',
          'pinCode',
          'lock-closed-outline'
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SÉCURITÉ GÉNÉRALE</Text>
        {renderSettingItem(
          'Verrouillage automatique',
          'Verrouiller automatiquement après inactivité',
          'autoLock',
          'time-outline'
        )}
        {renderSettingItem(
          'Alertes de connexion',
          'Recevoir des notifications lors des connexions',
          'loginAlerts',
          'notifications-outline'
        )}
        {renderSettingItem(
          'Chiffrement des messages',
          'Chiffrer les messages de bout en bout',
          'messageEncryption',
          'lock-closed-outline'
        )}
      </View>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 10,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
});

export default SecuritySettingsScreen;
