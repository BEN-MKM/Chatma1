import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BlockedUsersScreen = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBlockedUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement depuis une API
      // À remplacer par votre logique de chargement réelle
      const mockData = [
        {
          id: '1',
          username: 'Jean Martin',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          blockedDate: '2025-02-20T10:30:00Z',
        },
        {
          id: '2',
          username: 'Marie Dubois',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          blockedDate: '2025-02-19T15:45:00Z',
        },
      ];
      
      setBlockedUsers(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs bloqués:', error);
      Alert.alert('Erreur', 'Impossible de charger la liste des utilisateurs bloqués');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlockedUsers();
  }, [loadBlockedUsers]);

  const handleUnblock = useCallback(async (userId) => {
    Alert.alert(
      'Débloquer l\'utilisateur',
      'Êtes-vous sûr de vouloir débloquer cet utilisateur ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Débloquer',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simuler l'appel API pour débloquer
              // À remplacer par votre logique de déblocage réelle
              setBlockedUsers(current =>
                current.filter(user => user.id !== userId)
              );
              
              Alert.alert('Succès', 'L\'utilisateur a été débloqué');
            } catch (error) {
              console.error('Erreur lors du déblocage:', error);
              Alert.alert('Erreur', 'Impossible de débloquer l\'utilisateur');
            }
          },
        },
      ],
    );
  }, []);

  const renderBlockedUser = ({ item }) => (
    <View style={styles.userItem}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.blockedDate}>
          Bloqué le {new Date(item.blockedDate).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item.id)}
      >
        <Text style={styles.unblockText}>Débloquer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Utilisateurs Bloqués</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUser}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="shield-checkmark" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>
            Aucun utilisateur bloqué
          </Text>
        </View>
      )}
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
  list: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  blockedDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  unblockButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unblockText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default BlockedUsersScreen;
