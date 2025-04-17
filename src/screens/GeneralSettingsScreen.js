import React, { useState, useEffect, useCallback, useRef, useMemo, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
  BackHandler,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import supabase from '../config/supabase';

const GeneralSettingsScreen = ({ navigation }) => {
  const mounted = useRef(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // États
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);

  // Données constantes
  const languages = useMemo(() => [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '中文' }
  ], []);

  const fontSizes = useMemo(() => [
    { value: 'small', label: 'Petit' },
    { value: 'medium', label: 'Moyen' },
    { value: 'large', label: 'Grand' },
    { value: 'extra-large', label: 'Très grand' }
  ], []);

  // Paramètres par défaut
  const defaultSettings = useMemo(() => ({
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    accountPrivate: false,
    showActivity: true,
    allowTagging: true,
    twoFactorAuth: false,
    darkMode: false,
    fontSize: 'medium',
    language: 'fr',
    readReceipts: true,
    typing: true,
    mediaAutoDownload: true,
    locationSharing: false,
    dataCollection: true,
    autoPlayVideos: true,
    saveData: false,
    highQualityImages: true
  }), []);

  const [settings, setSettings] = useState(defaultSettings);
  const originalSettings = useRef(null);

  // Animation du bouton
  const animateButton = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  }, [scaleAnim]);

  // Chargement des paramètres
  const loadSettings = useCallback(async () => {
    if (!mounted.current) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data.settings);
        originalSettings.current = data.settings;
      } else {
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            settings: defaultSettings
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  }, [defaultSettings]);

  // Sauvegarde des paramètres
  const saveSettings = useCallback(async (newSettings) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: newSettings
        });

      if (error) throw error;

      setSettings(newSettings);
      setHasUnsavedChanges(false);
      animateButton();
      Alert.alert('Succès', 'Paramètres mis à jour avec succès');
    } catch (error) {
      Alert.alert('Erreur', error.message);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  }, [settings, animateButton]);

  // Gestionnaires d'événements
  const handleSettingChange = useCallback((key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasUnsavedChanges(true);

    switch (key) {
      case 'twoFactorAuth': {
        if (value) {
          navigation.navigate('TwoFactorSetup');
        }
        break;
      }
      case 'darkMode': {
        Alert.alert('Thème modifié', 'Le nouveau thème sera appliqué au prochain redémarrage');
        break;
      }
      case 'language': {
        const selectedLanguage = languages.find(lang => lang.code === value);
        if (selectedLanguage) {
          Alert.alert('Langue modifiée', `L'application est maintenant en ${selectedLanguage.label}`);
        }
        break;
      }
      case 'fontSize': {
        const selectedSize = fontSizes.find(size => size.value === value);
        if (selectedSize) {
          Alert.alert('Taille de police modifiée', `La taille de police est maintenant : ${selectedSize.label}`);
        }
        break;
      }
    }
  }, [settings, navigation, languages, fontSizes]);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await saveSettings(defaultSettings);
              if (settings.darkMode !== defaultSettings.darkMode) {
                Alert.alert('Thème modifié', 'Le thème par défaut sera appliqué au prochain redémarrage');
              }
            } catch (error) {
              Alert.alert('Erreur', error.message);
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  }, [settings, defaultSettings, saveSettings]);

  // Gestion de la navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) return;

      e.preventDefault();
      Alert.alert(
        'Modifications non sauvegardées',
        'Voulez-vous sauvegarder vos modifications avant de quitter ?',
        [
          {
            text: 'Ne pas sauvegarder',
            style: 'destructive',
            onPress: () => {
              setHasUnsavedChanges(false);
              navigation.dispatch(e.data.action);
            }
          },
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Sauvegarder',
            onPress: async () => {
              await saveSettings(settings);
              navigation.dispatch(e.data.action);
            }
          }
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, settings, saveSettings]);

  // Gestion du bouton retour Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (hasUnsavedChanges) {
          Alert.alert(
            'Modifications non sauvegardées',
            'Voulez-vous sauvegarder vos modifications avant de quitter ?',
            [
              {
                text: 'Ne pas sauvegarder',
                style: 'destructive',
                onPress: () => {
                  setHasUnsavedChanges(false);
                  navigation.goBack();
                }
              },
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Sauvegarder',
                onPress: async () => {
                  await saveSettings(settings);
                  navigation.goBack();
                }
              }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [hasUnsavedChanges, navigation, settings, saveSettings])
  );

  // Configuration du header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[styles.saveButton, (!hasUnsavedChanges || saving) && styles.saveButtonDisabled]}
          onPress={() => saveSettings(settings)}
          disabled={!hasUnsavedChanges || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          )}
        </TouchableOpacity>
      )
    });
  }, [navigation, hasUnsavedChanges, saving, settings, saveSettings]);

  // Chargement initial
  useEffect(() => {
    loadSettings();
    return () => {
      mounted.current = false;
    };
  }, [loadSettings]);


  const sections = [
    {
      title: 'Notifications',
      items: [
        {
          title: 'Notifications Push',
          description: 'Recevoir des notifications instantanées',
          key: 'pushNotifications',
          type: 'switch',
          icon: 'notifications-outline'
        },
        {
          title: 'Notifications Email',
          description: 'Recevoir des mises à jour par email',
          key: 'emailNotifications',
          type: 'switch',
          icon: 'mail-outline'
        },
        {
          title: 'Son',
          key: 'soundEnabled',
          type: 'switch',
          icon: 'volume-high-outline'
        },
        {
          title: 'Vibration',
          key: 'vibrationEnabled',
          type: 'switch',
          icon: 'phone-portrait-outline'
        }
      ]
    },
    {
      title: 'Confidentialité',
      items: [
        {
          title: 'Compte Privé',
          description: 'Seuls vos abonnés peuvent voir votre contenu',
          key: 'accountPrivate',
          type: 'switch',
          icon: 'lock-closed-outline'
        },
        {
          title: 'Authentification à Deux Facteurs',
          description: 'Sécurité renforcée pour votre compte',
          key: 'twoFactorAuth',
          type: 'switch',
          icon: 'shield-checkmark-outline'
        },
        {
          title: 'Partage de Position',
          description: 'Autoriser le partage de votre position',
          key: 'locationSharing',
          type: 'switch',
          icon: 'location-outline'
        }
      ]
    },
    {
      title: 'Affichage',
      items: [
        {
          title: 'Mode Sombre',
          key: 'darkMode',
          type: 'switch',
          icon: 'moon-outline'
        },
        {
          title: 'Taille de Police',
          key: 'fontSize',
          type: 'select',
          icon: 'text-outline',
          onPress: () => setShowFontSizeModal(true)
        },
        {
          title: 'Langue',
          key: 'language',
          type: 'select',
          icon: 'language-outline',
          onPress: () => setShowLanguageModal(true)
        }
      ]
    },
    {
      title: 'Chat',
      items: [
        {
          title: 'Accusés de Lecture',
          description: 'Montrer quand vous avez lu les messages',
          key: 'readReceipts',
          type: 'switch',
          icon: 'checkmark-done-outline'
        },
        {
          title: 'Indicateur de Frappe',
          description: 'Montrer quand vous écrivez',
          key: 'typing',
          type: 'switch',
          icon: 'chatbubble-ellipses-outline'
        },
        {
          title: 'Téléchargement Auto des Médias',
          key: 'mediaAutoDownload',
          type: 'switch',
          icon: 'cloud-download-outline'
        }
      ]
    }
  ];

  // Rendu des composants
  const renderSettingItem = useCallback(({ item }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color="#007AFF" style={styles.icon} />
        <View>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      {item.type === 'switch' ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Switch
            value={settings[item.key]}
            onValueChange={(value) => {
              animateButton();
              handleSettingChange(item.key, value);
            }}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings[item.key] ? '#007AFF' : '#f4f3f4'}
          />
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => {
            animateButton();
            item.onPress();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.settingButtonText}>
            {item.type === 'select' ? (
              item.key === 'language' ?
                languages.find(l => l.code === settings[item.key])?.label :
                fontSizes.find(s => s.value === settings[item.key])?.label
            ) : 'Configurer'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  ), [settings, scaleAnim, animateButton, handleSettingChange, languages, fontSizes]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {hasUnsavedChanges && (
        <View style={styles.unsavedBanner}>
          <Ionicons name="warning-outline" size={20} color="#ff9800" />
          <Text style={styles.unsavedText}>Modifications non sauvegardées</Text>
        </View>
      )}

      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <Fragment key={itemIndex}>
              {renderSettingItem({ item })}
            </Fragment>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetSettings}
      >
        <Ionicons name="refresh-outline" size={20} color="#fff" />
        <Text style={styles.resetButtonText}>Réinitialiser les paramètres</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir la langue</Text>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowLanguageModal(false)}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[styles.modalItem, settings.language === language.code && styles.modalItemSelected]}
                onPress={() => {
                  handleSettingChange('language', language.code);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={[styles.modalItemText, settings.language === language.code && styles.modalItemTextSelected]}>
                  {language.label}
                </Text>
                {settings.language === language.code && (
                  <Ionicons name="checkmark" size={24} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFontSizeModal}
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Taille de Police</Text>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowFontSizeModal(false)}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size.value}
                style={[styles.modalItem, settings.fontSize === size.value && styles.modalItemSelected]}
                onPress={() => {
                  handleSettingChange('fontSize', size.value);
                  setShowFontSizeModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    settings.fontSize === size.value && styles.modalItemTextSelected,
                    { fontSize: size.value === 'small' ? 14 : size.value === 'medium' ? 16 : size.value === 'large' ? 18 : 20 }
                  ]}
                >
                  {size.label}
                </Text>
                {settings.fontSize === size.value && (
                  <Ionicons name="checkmark" size={24} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.savingText}>Enregistrement...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  icon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  settingButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalItemTextSelected: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  savingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
  unsavedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  unsavedText: {
    marginLeft: 10,
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default GeneralSettingsScreen;
