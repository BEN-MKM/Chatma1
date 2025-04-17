import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { uploadFile } from '../utils/storageUtils';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
  });

  // Vérifier si des changements ont été effectués
  const hasChanges = useCallback(() => {
    if (!originalData) return false;
    return (
      originalData.full_name !== profileData.full_name ||
      originalData.username !== profileData.username ||
      originalData.phone !== profileData.phone ||
      originalData.bio !== profileData.bio ||
      originalData.avatar_url !== avatar
    );
  }, [originalData, profileData, avatar]);

  // Charger le profil
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        full_name: data.full_name || '',
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
      });
      setAvatar(data.avatar_url);
      setOriginalData({
        ...data,
        avatar_url: data.avatar_url,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le profil');
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setSaving(true);

        const fileUrl = await uploadFile(file.uri, 'avatars', {
          compress: true,
          path: `user_${user.id}`,
        });

        setAvatar(fileUrl);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
      console.error('Erreur chargement image:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      navigation.goBack();
      return;
    }

    try {
      setSaving(true);

      const updates = {
        ...profileData,
        avatar_url: avatar,
        updated_at: new Date().toISOString(),
      };

      await updateProfile(updates);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications');
      console.error('Erreur sauvegarde profil:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Modifier le profil
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!hasChanges() || saving}
            >
              <Text
                style={[
                  styles.saveButton,
                  { color: theme.colors.primary },
                  (!hasChanges() || saving) && { opacity: 0.5 },
                ]}
              >
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons
                    name="person-outline"
                    size={40}
                    color={theme.colors.placeholder}
                  />
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.editIconContainer,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleImagePick}
                disabled={saving}
              >
                <Ionicons name="camera" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleImagePick} disabled={saving}>
              <Text
                style={[
                  styles.changePhotoText,
                  { color: theme.colors.primary },
                  saving && { opacity: 0.5 },
                ]}
              >
                Changer la photo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nom complet
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                value={profileData.full_name}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, full_name: text }))
                }
                placeholder="Votre nom complet"
                placeholderTextColor={theme.colors.placeholder}
                editable={!saving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nom d'utilisateur
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                value={profileData.username}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, username: text }))
                }
                placeholder="Votre nom d'utilisateur"
                placeholderTextColor={theme.colors.placeholder}
                editable={!saving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.placeholder,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                value={profileData.email}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Téléphone
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                value={profileData.phone}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, phone: text }))
                }
                placeholder="Votre numéro de téléphone"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="phone-pad"
                editable={!saving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Bio
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.bioInput,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                value={profileData.bio}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, bio: text }))
                }
                placeholder="Parlez-nous de vous"
                placeholderTextColor={theme.colors.placeholder}
                multiline
                numberOfLines={4}
                editable={!saving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

export default EditProfileScreen;
