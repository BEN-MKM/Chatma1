import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MarketSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoAcceptOrders: false,
    showInventory: true,
    allowMessages: true,
    darkMode: false,
  });

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications push',
      description: 'Recevoir des notifications pour les nouvelles commandes',
      icon: 'notifications-outline',
    },
    {
      id: 'emailAlerts',
      title: 'Alertes par email',
      description: 'Recevoir des emails pour les activités importantes',
      icon: 'mail-outline',
    },
    {
      id: 'autoAcceptOrders',
      title: 'Acceptation automatique',
      description: 'Accepter automatiquement les nouvelles commandes',
      icon: 'checkmark-circle-outline',
    },
    {
      id: 'showInventory',
      title: 'Afficher le stock',
      description: 'Montrer la quantité disponible aux clients',
      icon: 'cube-outline',
    },
    {
      id: 'allowMessages',
      title: 'Messages clients',
      description: 'Autoriser les clients à envoyer des messages',
      icon: 'chatbubble-outline',
    },
    {
      id: 'darkMode',
      title: 'Mode sombre',
      description: 'Activer le thème sombre',
      icon: 'moon-outline',
    },
  ];

  const handleSettingChange = (settingId) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => navigation.navigate('Auth'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres du marché</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences générales</Text>
          {settingsOptions.map((option) => (
            <View key={option.id} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={24} color="#4CAF50" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingDescription}>{option.description}</Text>
                </View>
              </View>
              <Switch
                value={settings[option.id]}
                onValueChange={() => handleSettingChange(option.id)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('OrderManagement')}
          >
            <Ionicons name="list" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Gestion des commandes</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProductManagement')}
          >
            <Ionicons name="cube" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Gestion des produits</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PromotionsManagement')}
          >
            <Ionicons name="pricetag" size={24} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Gestion des promotions</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#FF4444" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF4444',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default MarketSettingsScreen;
