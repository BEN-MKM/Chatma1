import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const ChatBackupScreen = ({ navigation }) => {
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backupSize, setBackupSize] = useState(0);

  const loadBackupSettings = useCallback(async () => {
    try {
      const settings = await AsyncStorage.getItem('backupSettings');
      if (settings) {
        const { autoBackup, lastBackup } = JSON.parse(settings);
        setIsAutoBackupEnabled(autoBackup);
        setLastBackupDate(lastBackup);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  }, []);

  useEffect(() => {
    loadBackupSettings();
    calculateBackupSize();
  }, [loadBackupSettings]);

  const calculateBackupSize = async () => {
    try {
      // Simuler le calcul de la taille
      // À remplacer par votre logique réelle
      const size = Math.floor(Math.random() * 100) + 50; // 50-150 MB
      setBackupSize(size);
    } catch (error) {
      console.error('Erreur lors du calcul de la taille:', error);
    }
  };

  const toggleAutoBackup = async (value) => {
    try {
      setIsAutoBackupEnabled(value);
      await AsyncStorage.setItem('backupSettings', JSON.stringify({
        autoBackup: value,
        lastBackup: lastBackupDate,
      }));
    } catch (error) {
      console.error('Erreur lors de la modification des paramètres:', error);
      Alert.alert('Erreur', 'Impossible de modifier les paramètres de sauvegarde');
    }
  };

  const createBackup = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler la création de la sauvegarde
      // À remplacer par votre logique de sauvegarde réelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date().toISOString();
      setLastBackupDate(now);
      await AsyncStorage.setItem('backupSettings', JSON.stringify({
        autoBackup: isAutoBackupEnabled,
        lastBackup: now,
      }));

      Alert.alert('Succès', 'Sauvegarde créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de créer la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  }, [isAutoBackupEnabled]);

  const restoreBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.type === 'success') {
        setIsLoading(true);
        // Simuler la restauration
        // À remplacer par votre logique de restauration réelle
        await new Promise(resolve => setTimeout(resolve, 2000));
        Alert.alert('Succès', 'Sauvegarde restaurée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      Alert.alert('Erreur', 'Impossible de restaurer la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const exportBackup = async () => {
    try {
      const backupData = {
        // Simuler les données de sauvegarde
        // À remplacer par vos données réelles
        messages: [],
        settings: {},
        timestamp: new Date().toISOString(),
      };

      const backupString = JSON.stringify(backupData, null, 2);
      const fileUri = `${FileSystem.documentDirectory}backup_${Date.now()}.json`;
      
      await FileSystem.writeAsStringAsync(fileUri, backupString);
      
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter la sauvegarde',
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter la sauvegarde');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (mb) => {
    return `${mb} MB`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Sauvegarde des Messages</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sauvegarde Automatique</Text>
            <Switch
              value={isAutoBackupEnabled}
              onValueChange={toggleAutoBackup}
            />
          </View>
          <Text style={styles.sectionDescription}>
            Sauvegarder automatiquement vos messages chaque semaine
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dernière sauvegarde</Text>
            <Text style={styles.infoValue}>{formatDate(lastBackupDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Taille estimée</Text>
            <Text style={styles.infoValue}>{formatSize(backupSize)}</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={createBackup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Créer une sauvegarde</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={restoreBackup}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Restaurer une sauvegarde</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={exportBackup}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Exporter la sauvegarde</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonSection: {
    padding: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatBackupScreen;
