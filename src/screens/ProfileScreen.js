import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import supabase from '../config/supabase';
import { uploadFile } from '../utils/storageUtils';

const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    publications: 0,
    followers: 0,
    followings: 0,
    likes_received: 0,
    posts_count: 0,
    products_count: 0,
    total_sales: 0,
    rating: 0
  });

  const fetchProfile = useCallback(async () => {
    try {
      if (!user?.id) return;

      // Récupérer le profil et les statistiques en parallèle
      const [profileResult, statsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            id,
            username,
            full_name,
            avatar_url,
            bio,
            email,
            website,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single(),

        supabase
          .from('user_stats')
          .select(`
            publications,
            followers,
            followings,
            likes_received,
            posts_count,
            products_count
          `)
          .eq('user_id', user.id)
          .single()
      ]);

      if (profileResult.error) throw profileResult.error;

      setProfile(profileResult.data);
      setProfileImage(profileResult.data.avatar_url);

      if (statsResult.data) {
        setStats(statsResult.data);
      } else {
        // Créer les statistiques si elles n'existent pas
        const { data: newStats, error: statsError } = await supabase
          .from('user_stats')
          .insert([
            { 
              user_id: user.id,
              publications: 0,
              followers: 0,
              followings: 0,
              likes_received: 0,
              posts_count: 0,
              products_count: 0
            }
          ])
          .select()
          .single();

        if (statsError) throw statsError;
        setStats(newStats);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();

    // Souscription aux changements en temps réel du profil
    const profileSubscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user?.id}` },
        (payload) => {
          setProfile(payload.new);
          setProfileImage(payload.new.avatar_url);
        }
      )
      .subscribe();

    // Souscription aux changements des statistiques
    const statsSubscription = supabase
      .channel('stats_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          if (payload.eventType !== 'DELETE') {
            setStats(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
      statsSubscription.unsubscribe();
    };
  }, [user?.id, fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

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
        setLoading(true);

        const fileUrl = await uploadFile(file.uri, 'avatars', {
          compress: true,
          path: `user_${user.id}`,
        });

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: fileUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;
        setProfileImage(fileUrl);
      }
    } catch (error) {
      console.error('Erreur mise à jour avatar:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil');
    } finally {
      setLoading(false);
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleImagePick}
            disabled={loading}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                <Text style={[styles.avatarText, { color: theme.colors.text }]}>
                  {profile?.username?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={[styles.editIconContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {stats.publications}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>
                Publications
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {stats.followers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>
                Abonnés
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {stats.followings}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>
                Abonnements
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.fullName, { color: theme.colors.text }]}>
            {profile?.full_name}
          </Text>
          <Text style={[styles.username, { color: theme.colors.placeholder }]}>
            @{profile?.username}
          </Text>
          {profile?.bio && (
            <Text style={[styles.bio, { color: theme.colors.text }]}>
              {profile.bio}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Paramètres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChatmaPay')}
          >
            <Ionicons name="card" size={24} color={theme.colors.text} />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>ChatMa Pay</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Stats')}
          >
            <Ionicons name="stats-chart" size={24} color={theme.colors.text} />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Statistiques</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.text} />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <Ionicons name="ban" size={24} color={theme.colors.text} />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Utilisateurs bloqués</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={() => {
              Alert.alert(
                'Déconnexion',
                'Êtes-vous sûr de vouloir vous déconnecter ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: signOut
                  },
                ]
              );
            }}
          >
            <Ionicons name="log-out" size={24} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 24,
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
  },
  editIconContainer: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  profileInfo: {
    paddingHorizontal: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

});

export default ProfileScreen;
