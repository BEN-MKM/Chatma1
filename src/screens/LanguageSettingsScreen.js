import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LanguageSettingsScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', localName: 'Français' },
    { code: 'en', name: 'Anglais', localName: 'English' },
    { code: 'es', name: 'Espagnol', localName: 'Español' },
    { code: 'de', name: 'Allemand', localName: 'Deutsch' },
    { code: 'it', name: 'Italien', localName: 'Italiano' },
    { code: 'pt', name: 'Portugais', localName: 'Português' },
    { code: 'nl', name: 'Néerlandais', localName: 'Nederlands' },
    { code: 'ru', name: 'Russe', localName: 'Русский' },
    { code: 'ar', name: 'Arabe', localName: 'العربية' },
    { code: 'ja', name: 'Japonais', localName: '日本語' },
    { code: 'ko', name: 'Coréen', localName: '한국어' },
    { code: 'zh', name: 'Chinois', localName: '中文' }
  ];

  const handleLanguageSelect = (languageCode) => {
    Alert.alert(
      'Changer de langue',
      'Êtes-vous sûr de vouloir changer la langue de l\'application ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Changer',
          onPress: () => {
            setSelectedLanguage(languageCode);
            // Implémenter le changement de langue ici
            // i18n.changeLanguage(languageCode);
          }
        }
      ]
    );
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.languageName}>{item.name}</Text>
        <Text style={styles.languageLocalName}>{item.localName}</Text>
      </View>
      {selectedLanguage === item.code && (
        <Ionicons name="checkmark" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Choisir la langue</Text>
      <Text style={styles.headerDescription}>
        Sélectionnez la langue que vous souhaitez utiliser dans l'application
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
        ListHeaderComponent={renderSectionHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          La langue sélectionnée s'appliquera à l'ensemble de l'application
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8
  },
  headerDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden'
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF'
  },
  languageInfo: {
    flex: 1
  },
  languageName: {
    fontSize: 17,
    color: '#000000',
    marginBottom: 4
  },
  languageLocalName: {
    fontSize: 15,
    color: '#8E8E93'
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA'
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center'
  }
});

export default LanguageSettingsScreen;
